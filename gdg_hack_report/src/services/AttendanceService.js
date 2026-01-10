// Attendance Service - Handles facial recognition and attendance tracking
// Works offline using browser's local storage and IndexedDB
// NOTE: Uses simulated detection for demo. For production, integrate face-api.js

class AttendanceService {
  constructor() {
    this.isModelLoaded = false;
    this.registeredFaces = new Map();
    this.todayAttendance = new Map();
    this.dbName = 'EduPulseAttendanceDB';
    this.dbVersion = 1;
  }

  // Initialize face detection (simulated for demo)
  async loadModels() {
    if (this.isModelLoaded) return true;
    
    try {
      // In production, load face-api.js models here
      // For demo, we simulate the loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.isModelLoaded = true;
      console.log('Face detection initialized (simulation mode)');
      return true;
    } catch (error) {
      console.error('Error initializing face detection:', error);
      this.isModelLoaded = false;
      return false;
    }
  }

  // Initialize IndexedDB for offline storage
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store for registered student faces
        if (!db.objectStoreNames.contains('students')) {
          const studentStore = db.createObjectStore('students', { keyPath: 'id' });
          studentStore.createIndex('name', 'name', { unique: false });
          studentStore.createIndex('grade', 'grade', { unique: false });
        }
        
        // Store for attendance records
        if (!db.objectStoreNames.contains('attendance')) {
          const attendanceStore = db.createObjectStore('attendance', { keyPath: 'id', autoIncrement: true });
          attendanceStore.createIndex('studentId', 'studentId', { unique: false });
          attendanceStore.createIndex('date', 'date', { unique: false });
        }
        
        // Store for face descriptors
        if (!db.objectStoreNames.contains('faceDescriptors')) {
          db.createObjectStore('faceDescriptors', { keyPath: 'studentId' });
        }
      };
    });
  }

  // Register a student's face for recognition
  async registerStudent(studentId, name, grade, faceDescriptor) {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['students', 'faceDescriptors'], 'readwrite');
      
      const studentStore = transaction.objectStore('students');
      const faceStore = transaction.objectStore('faceDescriptors');
      
      studentStore.put({ id: studentId, name, grade, registeredAt: new Date().toISOString() });
      faceStore.put({ studentId, descriptor: Array.from(faceDescriptor) });
      
      transaction.oncomplete = () => {
        this.registeredFaces.set(studentId, { name, descriptor: faceDescriptor });
        resolve({ success: true, studentId, name });
      };
      
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Load all registered faces from IndexedDB
  async loadRegisteredFaces() {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['students', 'faceDescriptors'], 'readonly');
      const studentStore = transaction.objectStore('students');
      const faceStore = transaction.objectStore('faceDescriptors');
      
      const students = [];
      
      studentStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          students.push(cursor.value);
          cursor.continue();
        }
      };
      
      transaction.oncomplete = async () => {
        for (const student of students) {
          const faceRequest = faceStore.get(student.id);
          faceRequest.onsuccess = () => {
            if (faceRequest.result) {
              this.registeredFaces.set(student.id, {
                name: student.name,
                grade: student.grade,
                descriptor: new Float32Array(faceRequest.result.descriptor)
              });
            }
          };
        }
        resolve(Array.from(this.registeredFaces.entries()));
      };
      
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Detect faces in video frame (simulated for demo)
  async detectFaces(videoElement) {
    // For demo purposes, always use simulated detection
    // In production, integrate face-api.js or similar library
    return this.simulateDetection();
  }

  // Simulate detection for demo/offline mode
  simulateDetection() {
    const mockStudents = [
      { id: 's1', name: 'Arjun Singh', confidence: 0.94 },
      { id: 's2', name: 'Neha Gupta', confidence: 0.89 },
      { id: 's3', name: 'Vikram Reddy', confidence: 0.92 },
      { id: 's4', name: 'Priya Desai', confidence: 0.87 },
      { id: 's5', name: 'Ravi Mehta', confidence: 0.96 },
    ];
    
    // Randomly select present students (70-100% attendance)
    const presentCount = Math.floor(Math.random() * 2) + 4; // 4-5 students
    const shuffled = mockStudents.sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, presentCount).map(student => ({
      studentId: student.id,
      name: student.name,
      confidence: student.confidence,
      isRecognized: true,
      timestamp: new Date().toISOString()
    }));
  }

  // Match detected face with registered faces (simulated)
  matchFace(descriptor) {
    if (!descriptor || this.registeredFaces.size === 0) {
      return null;
    }
    
    let bestMatch = null;
    let minDistance = Infinity;
    
    // Simulated matching - in production use actual face comparison
    this.registeredFaces.forEach((data, studentId) => {
      const distance = Math.random() * 0.4; // Simulated distance
      if (distance < minDistance && distance < 0.6) {
        minDistance = distance;
        bestMatch = { studentId, name: data.name, confidence: 1 - distance };
      }
    });
    
    return bestMatch;
  }

  // Mark attendance for detected students
  async markAttendance(detectedStudents, classId = 'default') {
    const db = await this.initDB();
    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    const attendanceRecords = [];
    
    for (const student of detectedStudents) {
      const record = {
        studentId: student.studentId || student.id,
        studentName: student.name,
        classId,
        date: today,
        timestamp,
        confidence: student.confidence,
        status: 'present'
      };
      
      attendanceRecords.push(record);
      this.todayAttendance.set(record.studentId, record);
    }
    
    // Store in IndexedDB
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['attendance'], 'readwrite');
      const store = transaction.objectStore('attendance');
      
      attendanceRecords.forEach(record => store.add(record));
      
      transaction.oncomplete = () => resolve(attendanceRecords);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Get attendance for a specific date
  async getAttendanceByDate(date) {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['attendance'], 'readonly');
      const store = transaction.objectStore('attendance');
      const index = store.index('date');
      const records = [];
      
      index.openCursor(IDBKeyRange.only(date)).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          records.push(cursor.value);
          cursor.continue();
        }
      };
      
      transaction.oncomplete = () => resolve(records);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Get student's attendance history
  async getStudentAttendance(studentId) {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['attendance'], 'readonly');
      const store = transaction.objectStore('attendance');
      const index = store.index('studentId');
      const records = [];
      
      index.openCursor(IDBKeyRange.only(studentId)).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          records.push(cursor.value);
          cursor.continue();
        }
      };
      
      transaction.oncomplete = () => resolve(records);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Calculate attendance statistics
  calculateStats(attendanceRecords, totalStudents, totalDays) {
    const presentDays = new Set(attendanceRecords.map(r => r.date)).size;
    const uniqueStudents = new Set(attendanceRecords.map(r => r.studentId)).size;
    
    return {
      totalRecords: attendanceRecords.length,
      uniqueStudents,
      presentDays,
      averageAttendance: totalStudents > 0 ? (uniqueStudents / totalStudents) * 100 : 0,
      attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0
    };
  }

  // Sync with server when online (for backup)
  async syncWithServer(serverUrl) {
    if (!navigator.onLine) {
      console.log('Offline - data stored locally');
      return { synced: false, message: 'Offline mode' };
    }
    
    try {
      const db = await this.initDB();
      const transaction = db.transaction(['attendance'], 'readonly');
      const store = transaction.objectStore('attendance');
      
      const allRecords = await new Promise((resolve) => {
        const records = [];
        store.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            records.push(cursor.value);
            cursor.continue();
          } else {
            resolve(records);
          }
        };
      });
      
      // Send to server
      const response = await fetch(`${serverUrl}/api/attendance/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: allRecords })
      });
      
      if (response.ok) {
        return { synced: true, message: 'Data synced successfully', count: allRecords.length };
      }
      
      return { synced: false, message: 'Server sync failed' };
    } catch (error) {
      console.error('Sync error:', error);
      return { synced: false, message: error.message };
    }
  }
}

export const attendanceService = new AttendanceService();
export default AttendanceService;
