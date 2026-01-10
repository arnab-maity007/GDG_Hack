// FaceDatabase.js - Pre-registered students database with face descriptors
// This stores the face encodings for registered students

class FaceDatabase {
  constructor() {
    this.students = new Map();
    this.teachers = new Map();
    this.attendance = new Map(); // Today's attendance
    this.dbName = 'EduPulseFaceDB';
    this.initialized = false;
  }

  // Pre-registered students data
  getPreRegisteredStudents() {
    return [
      {
        id: 'student-umang',
        name: 'Umang',
        grade: '10A',
        rollNo: '001',
        photos: [
          '/faces/umang/photo1.jpg',
          '/faces/umang/photo2.jpg', 
          '/faces/umang/photo3.jpg'
        ],
        registeredAt: '2026-01-10',
        status: 'active'
      },
      {
        id: 'student-mayank',
        name: 'Mayank',
        grade: '10A',
        rollNo: '002',
        photos: ['/faces/mayank/photo1.jpg'],
        registeredAt: '2026-01-10',
        status: 'active'
      },
      {
        id: 'student-arnab',
        name: 'Arnab',
        grade: '10A',
        rollNo: '003',
        photos: ['/faces/arnab/photo1.jpg'],
        registeredAt: '2026-01-10',
        status: 'active'
      }
    ];
  }

  // Initialize database
  async initialize() {
    if (this.initialized) return;

    // Load pre-registered students
    const preRegistered = this.getPreRegisteredStudents();
    preRegistered.forEach(student => {
      this.students.set(student.id, {
        ...student,
        faceDescriptors: [], // Will be populated when face-api loads
        isPresent: false,
        markedAt: null
      });
    });

    // Initialize IndexedDB for persistence
    await this.initIndexedDB();
    
    this.initialized = true;
    console.log('Face database initialized with', this.students.size, 'students');
    return true;
  }

  // Initialize IndexedDB
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('students')) {
          const store = db.createObjectStore('students', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('grade', 'grade', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('attendance')) {
          const attStore = db.createObjectStore('attendance', { keyPath: 'id', autoIncrement: true });
          attStore.createIndex('studentId', 'studentId', { unique: false });
          attStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('faceDescriptors')) {
          db.createObjectStore('faceDescriptors', { keyPath: 'studentId' });
        }
      };
    });
  }

  // Get all students
  getAllStudents() {
    return Array.from(this.students.values());
  }

  // Get student by ID
  getStudent(studentId) {
    return this.students.get(studentId);
  }

  // Add new student
  async addStudent(studentData) {
    const id = `student-${studentData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const student = {
      id,
      name: studentData.name,
      grade: studentData.grade || '10A',
      rollNo: studentData.rollNo || String(this.students.size + 1).padStart(3, '0'),
      photos: studentData.photos || [],
      faceDescriptors: studentData.faceDescriptors || [],
      registeredAt: new Date().toISOString(),
      status: 'active',
      isPresent: false,
      markedAt: null
    };

    this.students.set(id, student);
    
    // Save to IndexedDB
    if (this.db) {
      const transaction = this.db.transaction(['students'], 'readwrite');
      transaction.objectStore('students').put(student);
    }

    return student;
  }

  // Store face descriptor for a student
  async storeFaceDescriptor(studentId, descriptor) {
    const student = this.students.get(studentId);
    if (student) {
      if (!student.faceDescriptors) {
        student.faceDescriptors = [];
      }
      student.faceDescriptors.push(Array.from(descriptor));
      this.students.set(studentId, student);

      // Save to IndexedDB
      if (this.db) {
        const transaction = this.db.transaction(['faceDescriptors'], 'readwrite');
        transaction.objectStore('faceDescriptors').put({
          studentId,
          descriptors: student.faceDescriptors
        });
      }
    }
  }

  // Get all face descriptors for matching
  getAllFaceDescriptors() {
    const descriptors = [];
    this.students.forEach((student, id) => {
      if (student.faceDescriptors && student.faceDescriptors.length > 0) {
        student.faceDescriptors.forEach(desc => {
          descriptors.push({
            studentId: id,
            name: student.name,
            descriptor: new Float32Array(desc)
          });
        });
      }
    });
    return descriptors;
  }

  // Mark student as present
  markPresent(studentId) {
    const student = this.students.get(studentId);
    if (student && !student.isPresent) {
      student.isPresent = true;
      student.markedAt = new Date().toISOString();
      this.students.set(studentId, student);

      // Add to attendance record
      const today = new Date().toISOString().split('T')[0];
      const attendanceKey = `${studentId}-${today}`;
      
      if (!this.attendance.has(attendanceKey)) {
        this.attendance.set(attendanceKey, {
          studentId,
          studentName: student.name,
          date: today,
          markedAt: student.markedAt,
          method: 'facial_recognition'
        });

        // Save to IndexedDB
        if (this.db) {
          const transaction = this.db.transaction(['attendance'], 'readwrite');
          transaction.objectStore('attendance').add({
            studentId,
            studentName: student.name,
            date: today,
            markedAt: student.markedAt,
            method: 'facial_recognition'
          });
        }
      }

      return true;
    }
    return false;
  }

  // Get present students
  getPresentStudents() {
    return Array.from(this.students.values()).filter(s => s.isPresent);
  }

  // Get absent students
  getAbsentStudents() {
    return Array.from(this.students.values()).filter(s => !s.isPresent);
  }

  // Get attendance for today
  getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.attendance.values()).filter(a => a.date === today);
  }

  // Reset daily attendance (call at start of each day)
  resetDailyAttendance() {
    this.students.forEach((student, id) => {
      student.isPresent = false;
      student.markedAt = null;
      this.students.set(id, student);
    });
    this.attendance.clear();
  }

  // Get attendance statistics
  getAttendanceStats() {
    const total = this.students.size;
    const present = this.getPresentStudents().length;
    const absent = total - present;
    
    return {
      total,
      present,
      absent,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }

  // Delete student
  async deleteStudent(studentId) {
    if (this.students.has(studentId)) {
      this.students.delete(studentId);
      
      if (this.db) {
        const transaction = this.db.transaction(['students', 'faceDescriptors'], 'readwrite');
        transaction.objectStore('students').delete(studentId);
        transaction.objectStore('faceDescriptors').delete(studentId);
      }
      
      return true;
    }
    return false;
  }
}

export const faceDatabase = new FaceDatabase();
export default faceDatabase;
