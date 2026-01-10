const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;

// In-memory storage (for demo - replace with MongoDB in production)
let attendanceRecords = [];
let teacherSessions = [];
let studentBehavior = [];
let alerts = [];
let students = [
  { id: 's1', name: 'Arjun Singh', grade: '10A', faceEncoding: null },
  { id: 's2', name: 'Neha Gupta', grade: '10A', faceEncoding: null },
  { id: 's3', name: 'Vikram Reddy', grade: '10A', faceEncoding: null },
  { id: 's4', name: 'Priya Desai', grade: '10A', faceEncoding: null },
  { id: 's5', name: 'Ravi Mehta', grade: '10A', faceEncoding: null },
  { id: 's6', name: 'Anjali Sharma', grade: '10B', faceEncoding: null },
  { id: 's7', name: 'Karan Patel', grade: '10B', faceEncoding: null },
];

// ============== ATTENDANCE ROUTES ==============
app.get('/api/test', (req, res) => {
  res.json({ message: 'EduPulse AI Backend is running!', version: '1.0.0' });
});

// Get all students
app.get('/api/students', (req, res) => {
  const { grade } = req.query;
  let result = students;
  if (grade) {
    result = students.filter(s => s.grade === grade);
  }
  res.json(result);
});

// Register student face
app.post('/api/students/:id/register-face', (req, res) => {
  const { id } = req.params;
  const { faceEncoding } = req.body;
  const student = students.find(s => s.id === id);
  if (student) {
    student.faceEncoding = faceEncoding;
    res.json({ success: true, message: 'Face registered successfully' });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Record attendance
app.post('/api/attendance', (req, res) => {
  const record = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...req.body
  };
  attendanceRecords.push(record);
  res.json({ success: true, record });
});

// Get attendance records
app.get('/api/attendance', (req, res) => {
  const { date, classId } = req.query;
  let results = attendanceRecords;
  
  if (date) {
    const targetDate = new Date(date).toDateString();
    results = results.filter(r => new Date(r.timestamp).toDateString() === targetDate);
  }
  if (classId) {
    results = results.filter(r => r.classId === classId);
  }
  
  res.json(results);
});

// Sync offline attendance
app.post('/api/attendance/sync', (req, res) => {
  const { records } = req.body;
  if (Array.isArray(records)) {
    records.forEach(record => {
      if (!attendanceRecords.find(r => r.id === record.id)) {
        attendanceRecords.push(record);
      }
    });
    res.json({ success: true, synced: records.length });
  } else {
    res.status(400).json({ error: 'Invalid records format' });
  }
});

// ============== TEACHER SESSION ROUTES ==============
app.post('/api/teacher-sessions', (req, res) => {
  const session = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...req.body
  };
  teacherSessions.push(session);
  
  // Generate alerts for poor performance
  if (session.onTopicPercentage < 70) {
    alerts.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'warning',
      category: 'teacher',
      message: `Teacher session below threshold: ${session.onTopicPercentage}% on-topic for ${session.topic}`,
      sessionId: session.id
    });
  }
  
  res.json({ success: true, session });
});

app.get('/api/teacher-sessions', (req, res) => {
  const { teacherId, date } = req.query;
  let results = teacherSessions;
  
  if (teacherId) {
    results = results.filter(s => s.teacherId === teacherId);
  }
  if (date) {
    const targetDate = new Date(date).toDateString();
    results = results.filter(s => new Date(s.timestamp).toDateString() === targetDate);
  }
  
  res.json(results);
});

// ============== STUDENT BEHAVIOR ROUTES ==============
app.post('/api/student-behavior', (req, res) => {
  const record = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...req.body
  };
  studentBehavior.push(record);
  
  // Generate alerts for low engagement
  if (record.averageEngagement < 50) {
    alerts.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'critical',
      category: 'engagement',
      message: `Low class engagement detected: ${record.averageEngagement.toFixed(0)}% average`,
      recordId: record.id
    });
  }
  
  // Alert for distracted students
  if (record.distractedCount > record.students?.length * 0.4) {
    alerts.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'warning',
      category: 'attention',
      message: `High distraction level: ${record.distractedCount} students distracted`,
      recordId: record.id
    });
  }
  
  res.json({ success: true, record });
});

app.get('/api/student-behavior', (req, res) => {
  const { studentId, classId, date } = req.query;
  let results = studentBehavior;
  
  if (classId) {
    results = results.filter(r => r.classId === classId);
  }
  if (date) {
    const targetDate = new Date(date).toDateString();
    results = results.filter(r => new Date(r.timestamp).toDateString() === targetDate);
  }
  
  res.json(results);
});

// ============== ALERTS ROUTES ==============
app.get('/api/alerts', (req, res) => {
  const { limit = 50, type } = req.query;
  let results = alerts;
  
  if (type) {
    results = results.filter(a => a.type === type);
  }
  
  res.json(results.slice(-parseInt(limit)).reverse());
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...req.body
  };
  alerts.push(alert);
  res.json({ success: true, alert });
});

app.delete('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  alerts = alerts.filter(a => a.id !== id);
  res.json({ success: true });
});

// ============== ANALYTICS ROUTES ==============
app.get('/api/analytics/summary', (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAttendance = attendanceRecords.filter(r => new Date(r.timestamp) >= today);
  const todaySessions = teacherSessions.filter(s => new Date(s.timestamp) >= today);
  const todayBehavior = studentBehavior.filter(b => new Date(b.timestamp) >= today);
  
  const summary = {
    totalStudents: students.length,
    attendanceSessions: todayAttendance.length,
    studentsPresent: todayAttendance.reduce((sum, r) => sum + (r.presentStudents?.length || 0), 0),
    teacherSessions: todaySessions.length,
    averageOnTopic: todaySessions.length > 0 
      ? todaySessions.reduce((sum, s) => sum + (s.onTopicPercentage || 0), 0) / todaySessions.length 
      : 0,
    behaviorSessions: todayBehavior.length,
    averageEngagement: todayBehavior.length > 0 
      ? todayBehavior.reduce((sum, b) => sum + (b.averageEngagement || 0), 0) / todayBehavior.length 
      : 0,
    alertsToday: alerts.filter(a => new Date(a.timestamp) >= today).length,
    recentAlerts: alerts.slice(-5).reverse()
  };
  
  res.json(summary);
});

app.get('/api/analytics/trends', (req, res) => {
  const { days = 7 } = req.query;
  const trends = [];
  
  for (let i = parseInt(days) - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const dayAttendance = attendanceRecords.filter(r => {
      const t = new Date(r.timestamp);
      return t >= date && t < nextDate;
    });
    
    const daySessions = teacherSessions.filter(s => {
      const t = new Date(s.timestamp);
      return t >= date && t < nextDate;
    });
    
    const dayBehavior = studentBehavior.filter(b => {
      const t = new Date(b.timestamp);
      return t >= date && t < nextDate;
    });
    
    trends.push({
      date: date.toISOString().split('T')[0],
      attendance: dayAttendance.reduce((sum, r) => sum + (r.presentStudents?.length || 0), 0),
      onTopicAvg: daySessions.length > 0 
        ? daySessions.reduce((sum, s) => sum + (s.onTopicPercentage || 0), 0) / daySessions.length 
        : 0,
      engagementAvg: dayBehavior.length > 0 
        ? dayBehavior.reduce((sum, b) => sum + (b.averageEngagement || 0), 0) / dayBehavior.length 
        : 0
    });
  }
  
  res.json(trends);
});

// ============== FUTURE CAPABILITIES / CAREER PREDICTION ==============
app.get('/api/students/:id/future-capabilities', (req, res) => {
  const { id } = req.params;
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  // Analyze behavior history
  const studentHistory = studentBehavior.filter(b => 
    b.students?.some(s => s.id === id)
  );
  
  // Calculate interest patterns (simulated for demo)
  const subjectInterests = {
    mathematics: Math.random() * 40 + 60,
    science: Math.random() * 40 + 50,
    english: Math.random() * 40 + 40,
    history: Math.random() * 40 + 30,
    arts: Math.random() * 40 + 35
  };
  
  const topInterest = Object.entries(subjectInterests)
    .sort((a, b) => b[1] - a[1])[0];
  
  const careerSuggestions = {
    mathematics: ['Engineer', 'Data Scientist', 'Banker', 'Economist'],
    science: ['Doctor', 'Scientist', 'Pharmacist', 'Environmental Specialist'],
    english: ['Writer', 'Journalist', 'Teacher', 'Content Creator'],
    history: ['Historian', 'Lawyer', 'Civil Servant', 'Archaeologist'],
    arts: ['Designer', 'Artist', 'Architect', 'Film Maker']
  };
  
  res.json({
    studentId: id,
    studentName: student.name,
    subjectInterests,
    topInterest: topInterest[0],
    interestScore: topInterest[1],
    suggestedCareers: careerSuggestions[topInterest[0]] || [],
    analysisMonths: 3,
    confidence: 0.75,
    recommendation: `Based on ${student.name}'s engagement patterns, they show strong aptitude for ${topInterest[0]}-related fields.`
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    records: {
      attendance: attendanceRecords.length,
      teacherSessions: teacherSessions.length,
      studentBehavior: studentBehavior.length,
      alerts: alerts.length
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EduPulse AI Backend running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});