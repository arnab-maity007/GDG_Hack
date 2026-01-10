// LiveDataService.js - Manages live data state across the application
// This service provides real-time data updates for dashboards

class LiveDataService {
  constructor() {
    this.listeners = new Map();
    this.data = {
      attendance: [],
      teacherSessions: [],
      studentBehavior: [],
      systemMetrics: {
        totalTeachers: 12,
        exemplaryTeachers: 9,
        needsImprovementTeachers: 3,
        averageTeacherQuality: 84.2,
        totalStudents: 245,
        averageAttendance: 91.5,
        averageEngagement: 78.3,
        classesProductive: 18,
        classesNeedImprovement: 4,
        totalClasses: 22,
        trends: [
          { week: 'Week 1', quality: 78, engagement: 72 },
          { week: 'Week 2', quality: 80, engagement: 75 },
          { week: 'Week 3', quality: 82, engagement: 78 },
          { week: 'Week 4', quality: 84, engagement: 80 },
          { week: 'Week 5', quality: 86, engagement: 83 },
        ]
      },
      alerts: [],
      recentSessions: []
    };
    
    // Initialize from localStorage if available
    this.loadFromStorage();
    
    // Start periodic updates
    this.startUpdates();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('eduPulseData');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.data = { ...this.data, ...parsed };
      }
    } catch (e) {
      console.log('No stored data found');
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('eduPulseData', JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save data');
    }
  }

  // Subscribe to data updates
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    // Return unsubscribe function
    return () => this.listeners.get(key).delete(callback);
  }

  // Notify listeners of updates
  notify(key) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => callback(this.data[key]));
    }
    // Also notify 'all' listeners
    if (this.listeners.has('all')) {
      this.listeners.get('all').forEach(callback => callback(this.data));
    }
  }

  // Record attendance session
  recordAttendance(sessionData) {
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      classId: sessionData.classId,
      presentStudents: sessionData.students,
      totalStudents: sessionData.total || sessionData.students.length,
      method: 'facial_recognition'
    };
    
    this.data.attendance.push(record);
    this.updateMetrics();
    this.saveToStorage();
    this.notify('attendance');
    
    return record;
  }

  // Record teacher session
  recordTeacherSession(sessionData) {
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      teacherId: sessionData.teacherId || 'teacher-1',
      teacherName: sessionData.teacherName || 'Current Teacher',
      subject: sessionData.subject,
      topic: sessionData.topic,
      duration: sessionData.duration,
      onTopicPercentage: sessionData.onTopicPercentage,
      grade: sessionData.grade,
      status: sessionData.status,
      suggestions: sessionData.suggestions || []
    };
    
    this.data.teacherSessions.push(record);
    this.data.recentSessions.unshift(record);
    this.data.recentSessions = this.data.recentSessions.slice(0, 10);
    this.updateMetrics();
    this.saveToStorage();
    this.notify('teacherSessions');
    
    return record;
  }

  // Record student behavior session
  recordStudentBehavior(behaviorData) {
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      classId: behaviorData.classId,
      averageEngagement: behaviorData.averageEngagement,
      attentiveCount: behaviorData.attentiveCount,
      distractedCount: behaviorData.distractedCount,
      handRaises: behaviorData.totalHandRaises,
      students: behaviorData.students
    };
    
    this.data.studentBehavior.push(record);
    this.updateMetrics();
    this.saveToStorage();
    this.notify('studentBehavior');
    
    return record;
  }

  // Add alert
  addAlert(alert) {
    const alertRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...alert
    };
    
    this.data.alerts.unshift(alertRecord);
    this.data.alerts = this.data.alerts.slice(0, 50);
    this.saveToStorage();
    this.notify('alerts');
    
    return alertRecord;
  }

  // Update system metrics
  updateMetrics() {
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate recent attendance average
    const recentAttendance = this.data.attendance.filter(a => new Date(a.timestamp) > weekAgo);
    if (recentAttendance.length > 0) {
      const avgAttendance = recentAttendance.reduce((sum, a) => 
        sum + (a.presentStudents.length / a.totalStudents) * 100, 0) / recentAttendance.length;
      this.data.systemMetrics.averageAttendance = Math.round(avgAttendance * 10) / 10;
    }
    
    // Calculate teacher quality
    const recentSessions = this.data.teacherSessions.filter(s => new Date(s.timestamp) > weekAgo);
    if (recentSessions.length > 0) {
      const avgQuality = recentSessions.reduce((sum, s) => sum + s.onTopicPercentage, 0) / recentSessions.length;
      this.data.systemMetrics.averageTeacherQuality = Math.round(avgQuality * 10) / 10;
      
      const exemplary = recentSessions.filter(s => s.onTopicPercentage >= 80).length;
      this.data.systemMetrics.exemplaryTeachers = Math.round((exemplary / recentSessions.length) * 12);
    }
    
    // Calculate engagement
    const recentBehavior = this.data.studentBehavior.filter(b => new Date(b.timestamp) > weekAgo);
    if (recentBehavior.length > 0) {
      const avgEngagement = recentBehavior.reduce((sum, b) => sum + b.averageEngagement, 0) / recentBehavior.length;
      this.data.systemMetrics.averageEngagement = Math.round(avgEngagement * 10) / 10;
    }

    this.notify('systemMetrics');
  }

  // Get current data
  getData(key) {
    return key ? this.data[key] : this.data;
  }

  // Get system metrics
  getSystemMetrics() {
    return this.data.systemMetrics;
  }

  // Get recent alerts
  getAlerts(limit = 10) {
    return this.data.alerts.slice(0, limit);
  }

  // Get today's summary
  getTodaySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAttendance = this.data.attendance.filter(a => new Date(a.timestamp) >= today);
    const todaySessions = this.data.teacherSessions.filter(s => new Date(s.timestamp) >= today);
    const todayBehavior = this.data.studentBehavior.filter(b => new Date(b.timestamp) >= today);
    
    return {
      attendanceSessions: todayAttendance.length,
      studentsTracked: todayAttendance.reduce((sum, a) => sum + a.presentStudents.length, 0),
      teacherSessions: todaySessions.length,
      averageOnTopic: todaySessions.length > 0 
        ? todaySessions.reduce((sum, s) => sum + s.onTopicPercentage, 0) / todaySessions.length 
        : 0,
      behaviorSessions: todayBehavior.length,
      averageEngagement: todayBehavior.length > 0 
        ? todayBehavior.reduce((sum, b) => sum + b.averageEngagement, 0) / todayBehavior.length 
        : 0,
      alerts: this.data.alerts.filter(a => new Date(a.timestamp) >= today).length
    };
  }

  // Start periodic updates for demo
  startUpdates() {
    // Update trends periodically
    setInterval(() => {
      // Simulate slight metric variations for live feel
      const metrics = this.data.systemMetrics;
      metrics.averageEngagement = Math.max(60, Math.min(95, 
        metrics.averageEngagement + (Math.random() - 0.5) * 2));
      metrics.averageTeacherQuality = Math.max(70, Math.min(98, 
        metrics.averageTeacherQuality + (Math.random() - 0.5) * 1));
      
      this.notify('systemMetrics');
    }, 30000); // Every 30 seconds
  }

  // Clear all data
  clearData() {
    this.data = {
      attendance: [],
      teacherSessions: [],
      studentBehavior: [],
      systemMetrics: this.data.systemMetrics,
      alerts: [],
      recentSessions: []
    };
    this.saveToStorage();
    this.notify('all');
  }
}

export const liveDataService = new LiveDataService();
export default liveDataService;
