// Student Attentiveness Service - Monitors student behavior and engagement
// Uses ML for posture detection, hand movements, and engagement tracking

class StudentAttentivenessService {
  constructor() {
    this.isMonitoring = false;
    this.studentData = new Map();
    this.sessionHistory = [];
    this.dbName = 'EduPulseStudentDB';
    this.engagementThresholds = {
      excellent: 85,
      good: 70,
      moderate: 55,
      low: 40
    };
  }

  // Behavior categories for ML detection
  behaviorCategories = {
    attentive: ['looking_at_board', 'taking_notes', 'hand_raised', 'nodding'],
    engaged: ['asking_question', 'answering', 'discussing', 'writing'],
    distracted: ['looking_away', 'talking_to_peer', 'using_phone', 'sleeping'],
    neutral: ['sitting_still', 'listening', 'idle']
  };

  // Interest indicators by subject
  interestIndicators = {
    mathematics: ['problem_solving', 'quick_answers', 'board_focus', 'note_taking'],
    science: ['experiment_interest', 'questioning', 'diagram_drawing', 'curiosity'],
    english: ['reading_engagement', 'discussion', 'writing', 'vocabulary_interest'],
    history: ['story_listening', 'map_interest', 'date_recall', 'questioning'],
    art: ['creativity', 'drawing', 'color_interest', 'visual_focus']
  };

  // Initialize the service
  async initialize() {
    await this.initDB();
    await this.loadHistoricalData();
    return true;
  }

  // Initialize IndexedDB
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('studentBehavior')) {
          const store = db.createObjectStore('studentBehavior', { keyPath: 'id', autoIncrement: true });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('subject', 'subject', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('studentProfiles')) {
          const profileStore = db.createObjectStore('studentProfiles', { keyPath: 'studentId' });
          profileStore.createIndex('grade', 'grade', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('predictions')) {
          const predStore = db.createObjectStore('predictions', { keyPath: 'studentId' });
        }
      };
    });
  }

  // Start monitoring session
  startMonitoring(classId, subject, students, callbacks = {}) {
    this.isMonitoring = true;
    this.currentClassId = classId;
    this.currentSubject = subject;
    this.sessionStartTime = new Date();
    this.onUpdate = callbacks.onUpdate;
    this.onAlert = callbacks.onAlert;
    
    // Initialize student data for this session
    students.forEach(student => {
      this.studentData.set(student.id, {
        studentId: student.id,
        name: student.name,
        engagementScore: 75, // Starting score
        attentionSpans: [],
        behaviors: [],
        handRaises: 0,
        questionsAsked: 0,
        interactionScore: 0,
        currentState: 'attentive'
      });
    });
    
    // Start simulation for demo
    this.startSimulation();
    
    return { success: true, studentsTracked: students.length };
  }

  // Stop monitoring
  stopMonitoring() {
    this.isMonitoring = false;
    
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    
    const sessionReport = this.generateSessionReport();
    this.saveSessionData(sessionReport);
    
    return sessionReport;
  }

  // Detect behavior from video frame (simulated for demo)
  detectBehavior(studentId) {
    const behaviors = [
      { type: 'attentive', subtype: 'looking_at_board', weight: 1.0 },
      { type: 'attentive', subtype: 'taking_notes', weight: 1.2 },
      { type: 'engaged', subtype: 'hand_raised', weight: 1.5 },
      { type: 'engaged', subtype: 'asking_question', weight: 1.8 },
      { type: 'neutral', subtype: 'sitting_still', weight: 0.7 },
      { type: 'distracted', subtype: 'looking_away', weight: -0.5 },
      { type: 'distracted', subtype: 'talking_to_peer', weight: -0.3 },
    ];
    
    // Weighted random selection (biased towards positive behaviors)
    const weights = [0.3, 0.25, 0.1, 0.05, 0.15, 0.1, 0.05];
    const random = Math.random();
    let cumWeight = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumWeight += weights[i];
      if (random < cumWeight) {
        return behaviors[i];
      }
    }
    
    return behaviors[0];
  }

  // Update student engagement score
  updateEngagement(studentId, behavior) {
    const student = this.studentData.get(studentId);
    if (!student) return;
    
    const scoreChange = behavior.weight * 2;
    student.engagementScore = Math.max(0, Math.min(100, 
      student.engagementScore + scoreChange
    ));
    
    student.behaviors.push({
      timestamp: new Date().toISOString(),
      type: behavior.type,
      subtype: behavior.subtype
    });
    
    student.currentState = behavior.type;
    
    if (behavior.subtype === 'hand_raised') {
      student.handRaises++;
    }
    if (behavior.subtype === 'asking_question') {
      student.questionsAsked++;
    }
    
    // Calculate interaction score
    student.interactionScore = Math.min(100, 
      (student.handRaises * 10) + (student.questionsAsked * 15)
    );
    
    // Check for alerts
    if (student.engagementScore < this.engagementThresholds.low) {
      this.triggerAlert(studentId, 'low_engagement', student.engagementScore);
    }
    
    this.studentData.set(studentId, student);
  }

  // Trigger alert for concerning behavior
  triggerAlert(studentId, alertType, value) {
    const student = this.studentData.get(studentId);
    if (this.onAlert) {
      this.onAlert({
        studentId,
        studentName: student?.name,
        alertType,
        value,
        timestamp: new Date().toISOString(),
        message: `${student?.name} has low engagement (${value.toFixed(0)}%)`
      });
    }
  }

  // Get current class status
  getClassStatus() {
    const students = Array.from(this.studentData.values());
    
    const avgEngagement = students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length;
    const attentiveCount = students.filter(s => s.currentState === 'attentive' || s.currentState === 'engaged').length;
    const distractedCount = students.filter(s => s.currentState === 'distracted').length;
    
    return {
      totalStudents: students.length,
      averageEngagement: avgEngagement,
      attentiveCount,
      distractedCount,
      neutralCount: students.length - attentiveCount - distractedCount,
      attentionRate: (attentiveCount / students.length) * 100,
      students: students.map(s => ({
        id: s.studentId,
        name: s.name,
        engagement: s.engagementScore,
        state: s.currentState,
        handRaises: s.handRaises,
        interactions: s.interactionScore
      }))
    };
  }

  // Simulation for demo mode
  startSimulation() {
    this.simulationInterval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(this.simulationInterval);
        return;
      }
      
      // Update each student
      this.studentData.forEach((student, studentId) => {
        const behavior = this.detectBehavior(studentId);
        this.updateEngagement(studentId, behavior);
      });
      
      // Send update
      if (this.onUpdate) {
        this.onUpdate(this.getClassStatus());
      }
    }, 2000);
  }

  // Generate session report
  generateSessionReport() {
    const students = Array.from(this.studentData.values());
    const duration = Math.round((new Date() - this.sessionStartTime) / 1000 / 60);
    
    return {
      classId: this.currentClassId,
      subject: this.currentSubject,
      date: new Date().toISOString().split('T')[0],
      duration,
      sessionStart: this.sessionStartTime.toISOString(),
      sessionEnd: new Date().toISOString(),
      summary: {
        averageEngagement: students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length,
        totalHandRaises: students.reduce((sum, s) => sum + s.handRaises, 0),
        totalQuestions: students.reduce((sum, s) => sum + s.questionsAsked, 0),
        mostEngaged: students.sort((a, b) => b.engagementScore - a.engagementScore)[0],
        leastEngaged: students.sort((a, b) => a.engagementScore - b.engagementScore)[0]
      },
      studentReports: students.map(s => ({
        studentId: s.studentId,
        name: s.name,
        finalEngagement: s.engagementScore,
        handRaises: s.handRaises,
        questionsAsked: s.questionsAsked,
        interactionScore: s.interactionScore,
        behaviorSummary: this.summarizeBehaviors(s.behaviors)
      }))
    };
  }

  // Summarize behaviors for a student
  summarizeBehaviors(behaviors) {
    const counts = {};
    behaviors.forEach(b => {
      counts[b.type] = (counts[b.type] || 0) + 1;
    });
    
    const total = behaviors.length || 1;
    return {
      attentivePercent: ((counts.attentive || 0) / total) * 100,
      engagedPercent: ((counts.engaged || 0) / total) * 100,
      distractedPercent: ((counts.distracted || 0) / total) * 100,
      neutralPercent: ((counts.neutral || 0) / total) * 100
    };
  }

  // Save session data to IndexedDB
  async saveSessionData(sessionReport) {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['studentBehavior'], 'readwrite');
      const store = transaction.objectStore('studentBehavior');
      
      sessionReport.studentReports.forEach(report => {
        store.add({
          studentId: report.studentId,
          date: sessionReport.date,
          subject: sessionReport.subject,
          engagement: report.finalEngagement,
          interactions: report.interactionScore,
          behaviors: report.behaviorSummary,
          duration: sessionReport.duration
        });
      });
      
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Open database
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Load historical data
  async loadHistoricalData() {
    try {
      const db = await this.openDB();
      // Load historical data if needed
      return true;
    } catch (error) {
      console.log('No historical data found');
      return false;
    }
  }

  // Predict future capabilities based on long-term data
  predictFutureCapabilities(studentId, historicalData) {
    // Analyze engagement patterns across subjects
    const subjectScores = {};
    
    historicalData.forEach(record => {
      if (!subjectScores[record.subject]) {
        subjectScores[record.subject] = { total: 0, count: 0 };
      }
      subjectScores[record.subject].total += record.engagement;
      subjectScores[record.subject].count++;
    });
    
    // Calculate average per subject
    const subjectAverages = {};
    Object.entries(subjectScores).forEach(([subject, data]) => {
      subjectAverages[subject] = data.total / data.count;
    });
    
    // Sort by interest level
    const sortedSubjects = Object.entries(subjectAverages)
      .sort(([,a], [,b]) => b - a);
    
    // Generate career predictions based on top subjects
    const careerMap = {
      mathematics: ['Engineer', 'Data Scientist', 'Mathematician', 'Actuary'],
      science: ['Doctor', 'Scientist', 'Researcher', 'Pharmacist'],
      english: ['Writer', 'Journalist', 'Teacher', 'Editor'],
      history: ['Historian', 'Archaeologist', 'Lawyer', 'Professor'],
      art: ['Artist', 'Designer', 'Architect', 'Animator']
    };
    
    const topSubjects = sortedSubjects.slice(0, 2);
    const predictions = [];
    
    topSubjects.forEach(([subject]) => {
      if (careerMap[subject]) {
        predictions.push(...careerMap[subject].slice(0, 2));
      }
    });
    
    return {
      studentId,
      topInterests: sortedSubjects.slice(0, 3).map(([sub, score]) => ({
        subject: sub,
        interestLevel: score
      })),
      predictedCareers: [...new Set(predictions)].slice(0, 4),
      confidence: Math.min(historicalData.length / 100, 1) * 100,
      recommendation: this.generateRecommendation(sortedSubjects)
    };
  }

  // Generate learning recommendation
  generateRecommendation(sortedSubjects) {
    if (sortedSubjects.length === 0) {
      return 'Not enough data to generate recommendations';
    }
    
    const [topSubject, topScore] = sortedSubjects[0];
    const [lowSubject, lowScore] = sortedSubjects[sortedSubjects.length - 1];
    
    return `Student shows high interest in ${topSubject} (${topScore?.toFixed(0) || 0}%). ` +
           `Consider additional focus on ${lowSubject} to improve overall engagement. ` +
           `Encourage participation through interactive activities.`;
  }

  // Get student progress over time
  async getStudentProgress(studentId, timeRange = 30) {
    const db = await this.openDB();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['studentBehavior'], 'readonly');
      const store = transaction.objectStore('studentBehavior');
      const index = store.index('studentId');
      const records = [];
      
      index.openCursor(IDBKeyRange.only(studentId)).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (new Date(cursor.value.date) >= startDate) {
            records.push(cursor.value);
          }
          cursor.continue();
        }
      };
      
      transaction.oncomplete = () => {
        resolve(this.analyzeProgress(records));
      };
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Analyze progress trends
  analyzeProgress(records) {
    if (records.length === 0) {
      return { trend: 'no_data', records: [] };
    }
    
    const sorted = records.sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
    
    const avgFirst = firstHalf.reduce((sum, r) => sum + r.engagement, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, r) => sum + r.engagement, 0) / secondHalf.length;
    
    let trend = 'stable';
    if (avgSecond - avgFirst > 5) trend = 'improving';
    if (avgFirst - avgSecond > 5) trend = 'declining';
    
    return {
      trend,
      improvement: avgSecond - avgFirst,
      currentAverage: avgSecond,
      previousAverage: avgFirst,
      records: sorted
    };
  }
}

export const studentAttentivenessService = new StudentAttentivenessService();
export default StudentAttentivenessService;
