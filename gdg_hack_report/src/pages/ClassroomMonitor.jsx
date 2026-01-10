import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Video, Camera, Mic, MicOff, Users, 
  AlertTriangle, TrendingUp, BookOpen, Eye, Hand, Brain, Activity
} from 'lucide-react';
import { teacherMonitoringService } from '../services/TeacherMonitoringService';
import { studentAttentivenessService } from '../services/StudentAttentivenessService';
import { attendanceService } from '../services/AttendanceService';

// Mock student data for demo
const mockStudents = [
  { id: 's1', name: 'Arjun Singh', grade: '10A' },
  { id: 's2', name: 'Neha Gupta', grade: '10A' },
  { id: 's3', name: 'Vikram Reddy', grade: '10A' },
  { id: 's4', name: 'Priya Desai', grade: '10A' },
  { id: 's5', name: 'Ravi Mehta', grade: '10A' },
];

// Attendance Panel Component
const AttendancePanel = ({ onAttendanceUpdate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.log('Camera not available, using simulation mode');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const startAttendanceScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setAttendance([]);
    
    await startCamera();
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 500);

    setTimeout(async () => {
      const detected = attendanceService.simulateDetection();
      setAttendance(detected);
      await attendanceService.markAttendance(detected, 'class-10a');
      if (onAttendanceUpdate) onAttendanceUpdate(detected);
      setIsScanning(false);
      stopCamera();
    }, 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Facial Attendance System
        </h3>
        <span className="text-sm text-gray-500">Offline Capable</span>
      </div>
      
      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ minHeight: '200px' }}>
        {cameraActive ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <Camera className="w-16 h-16 text-gray-600" />
          </div>
        )}
        {isScanning && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-pulse text-lg font-semibold">Scanning Faces...</div>
              <div className="mt-2 bg-white/20 rounded-full h-2 w-32 mx-auto">
                <div className="bg-green-400 h-2 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <button onClick={startAttendanceScan} disabled={isScanning}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2
          ${isScanning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
        <Camera className="w-5 h-5" />
        <span>{isScanning ? 'Scanning...' : 'Start Attendance Scan'}</span>
      </button>
      
      {attendance.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-green-600">✓ {attendance.length} Students Detected</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {attendance.map((student, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 p-2 rounded">
                <span className="font-medium">{student.name}</span>
                <span className="text-sm text-green-600">{(student.confidence * 100).toFixed(0)}% match</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Teacher Monitoring Panel Component
const TeacherMonitoringPanel = ({ topic, subject, onReportUpdate }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [report, setReport] = useState(null);

  const startMonitoring = () => {
    teacherMonitoringService.initSpeechRecognition();
    teacherMonitoringService.startMonitoring(topic, subject, {
      onTranscript: (fullTranscript) => setTranscript(fullTranscript),
      onAnalysis: (analysisData) => setAnalysis(analysisData),
      onError: (error) => console.error('Speech error:', error)
    });
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    const finalReport = teacherMonitoringService.stopMonitoring();
    setReport(finalReport);
    setIsMonitoring(false);
    if (onReportUpdate) onReportUpdate(finalReport);
  };

  const getStatusColor = (status) => {
    if (status === 'Excellent' || status === 'Exemplary') return 'text-green-600 bg-green-100';
    if (status === 'Good') return 'text-blue-600 bg-blue-100';
    if (status === 'Needs Improvement') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Mic className="w-6 h-6 mr-2 text-purple-600" />
          Teacher Topic Monitoring
        </h3>
        <span className="text-sm text-gray-500">Works Offline</span>
      </div>
      
      <div className="bg-purple-50 p-3 rounded-lg mb-4">
        <p className="text-sm text-purple-600 font-medium">Expected Topic:</p>
        <p className="text-purple-900">{topic}</p>
      </div>
      
      <button onClick={isMonitoring ? stopMonitoring : startMonitoring}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2
          ${isMonitoring ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
        {isMonitoring ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        <span>{isMonitoring ? 'Stop Monitoring' : 'Start Voice Monitoring'}</span>
      </button>
      
      {analysis && isMonitoring && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">On-Topic Score:</span>
            <span className={`px-3 py-1 rounded-full font-bold ${getStatusColor(analysis.status)}`}>{analysis.onTopicPercentage}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500" style={{ width: `${analysis.onTopicPercentage}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-50 p-2 rounded"><span className="text-green-600">On-Topic:</span> {analysis.onTopicMinutes} min</div>
            <div className="bg-red-50 p-2 rounded"><span className="text-red-600">Off-Topic:</span> {analysis.offTopicMinutes} min</div>
          </div>
        </div>
      )}
      
      {transcript && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Live Transcript:</h4>
          <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto text-sm text-gray-700">{transcript}</div>
        </div>
      )}
      
      {report && !isMonitoring && (
        <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-lg mb-2">Session Report</h4>
          <p><strong>Grade:</strong> <span className="text-2xl font-bold text-purple-600">{report.grade}</span></p>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Duration:</strong> {report.totalDuration} minutes</p>
          {report.suggestions?.length > 0 && (
            <div className="mt-3">
              <h5 className="font-semibold">Suggestions:</h5>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {report.suggestions.map((s, i) => <li key={i}>{s.message}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Student Attentiveness Panel Component
const StudentAttentivenessPanel = ({ students, onStatusUpdate }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [classStatus, setClassStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const startTracking = async () => {
    await studentAttentivenessService.initialize();
    studentAttentivenessService.startMonitoring('class-10a', 'mathematics', students, {
      onUpdate: (status) => { setClassStatus(status); if (onStatusUpdate) onStatusUpdate(status); },
      onAlert: (alert) => setAlerts(prev => [alert, ...prev].slice(0, 5))
    });
    setIsTracking(true);
  };

  const stopTracking = () => {
    studentAttentivenessService.stopMonitoring();
    setIsTracking(false);
  };

  const getEngagementColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStateIcon = (state) => {
    if (state === 'attentive') return <Eye className="w-4 h-4 text-green-500" />;
    if (state === 'engaged') return <Hand className="w-4 h-4 text-blue-500" />;
    if (state === 'distracted') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Brain className="w-6 h-6 mr-2 text-green-600" />
          Student Attentiveness Tracking
        </h3>
        <span className="text-sm text-gray-500">ML Powered</span>
      </div>
      
      <button onClick={isTracking ? stopTracking : startTracking}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2
          ${isTracking ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
        <Eye className="w-5 h-5" />
        <span>{isTracking ? 'Stop Tracking' : 'Start Behavior Tracking'}</span>
      </button>
      
      {classStatus && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{classStatus.attentiveCount}</p>
              <p className="text-xs text-green-700">Attentive</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{classStatus.neutralCount}</p>
              <p className="text-xs text-yellow-700">Neutral</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{classStatus.distractedCount}</p>
              <p className="text-xs text-red-700">Distracted</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-blue-800">Class Engagement</span>
              <span className="font-bold text-blue-600">{classStatus.averageEngagement.toFixed(0)}%</span>
            </div>
            <div className="bg-blue-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${classStatus.averageEngagement}%` }} />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2">
            {classStatus.students.map((student) => (
              <div key={student.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getStateIcon(student.state)}
                  <span className="font-medium text-sm">{student.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {student.handRaises > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">🖐 {student.handRaises}</span>
                  )}
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getEngagementColor(student.engagement)}`} style={{ width: `${student.engagement}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8">{student.engagement.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {alerts.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-red-600 mb-2">⚠️ Alerts</h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {alerts.map((alert, idx) => (
              <div key={idx} className="text-sm bg-red-50 text-red-700 p-2 rounded">{alert.message}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Classroom Monitor Component
export const ClassroomMonitor = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('Quadratic Equations');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [attendanceData, setAttendanceData] = useState([]);
  const [teacherReport, setTeacherReport] = useState(null);
  const [studentStatus, setStudentStatus] = useState(null);

  const topics = {
    Mathematics: ['Quadratic Equations', 'Linear Equations', 'Trigonometry', 'Algebra', 'Geometry'],
    Science: ['Photosynthesis', 'Newton Laws', 'Atoms', 'Chemical Reactions'],
    English: ['Grammar', 'Literature', 'Writing Skills'],
    History: ['Independence Movement', 'Ancient India', 'Medieval Period']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold">
              <ArrowLeft className="w-5 h-5" /><span>Back to Main Menu</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Live Classroom Monitor</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Live
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(topics[e.target.value][0]); }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                {Object.keys(topics).map(subject => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Today's Topic</label>
              <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                {topics[selectedSubject].map(topic => <option key={topic} value={topic}>{topic}</option>)}
              </select>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <span className="text-sm text-blue-600">Class: </span><span className="font-bold text-blue-800">10A</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <AttendancePanel onAttendanceUpdate={setAttendanceData} />
          <TeacherMonitoringPanel topic={selectedTopic} subject={selectedSubject} onReportUpdate={setTeacherReport} />
          <StudentAttentivenessPanel students={mockStudents} onStatusUpdate={setStudentStatus} />
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />Session Summary
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <Users className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-3xl font-bold">{attendanceData.length || 0}</p>
              <p className="text-sm opacity-80">Students Present</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <BookOpen className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-3xl font-bold">{teacherReport?.onTopicPercentage || '--'}%</p>
              <p className="text-sm opacity-80">On-Topic Teaching</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white">
              <Eye className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-3xl font-bold">{studentStatus?.averageEngagement?.toFixed(0) || '--'}%</p>
              <p className="text-sm opacity-80">Avg Engagement</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <Hand className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-3xl font-bold">{studentStatus?.students?.reduce((sum, s) => sum + s.handRaises, 0) || 0}</p>
              <p className="text-sm opacity-80">Hand Raises</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How This System Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-600 mb-2">📷 Facial Attendance</h4>
              <p className="text-gray-600 text-sm">Uses the classroom camera to detect and recognize student faces. Automatically marks attendance. <strong className="text-blue-600">Works completely offline.</strong></p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-600 mb-2">🎤 Teacher Monitoring</h4>
              <p className="text-gray-600 text-sm">Captures teacher's speech and analyzes it against the expected curriculum topic. <strong className="text-purple-600">Works offline using Web Speech API.</strong></p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-600 mb-2">🧠 Student Tracking</h4>
              <p className="text-gray-600 text-sm">ML-powered behavior detection tracks attention levels and participation. <strong className="text-green-600">Predicts career paths based on interests.</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
