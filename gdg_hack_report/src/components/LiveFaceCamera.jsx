// LiveFaceCamera.jsx - REDESIGNED Real-time face detection with improved UI
import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, Users, UserCheck, UserX, AlertCircle, 
  Loader, Video, VideoOff, RefreshCw,
  CheckCircle, XCircle, Clock, Scan, Eye, Zap
} from 'lucide-react';
import { faceRecognitionService } from '../services/FaceRecognitionService';
import { faceDatabase } from '../services/FaceDatabase';

const LiveFaceCamera = ({ onAttendanceUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [presentStudents, setPresentStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [isDetecting, setIsDetecting] = useState(false);
  const detectionInterval = useRef(null);
  const [detectionStatus, setDetectionStatus] = useState(null);
  const [recognitionMode, setRecognitionMode] = useState('loading');

  useEffect(() => {
    initializeFaceRecognition();
    
    const handleAttendanceChange = (event) => {
      updateAttendanceDisplay();
      if (onAttendanceUpdate) {
        onAttendanceUpdate(event.detail);
      }
    };
    
    window.addEventListener('attendanceChange', handleAttendanceChange);
    
    return () => {
      window.removeEventListener('attendanceChange', handleAttendanceChange);
      stopCamera();
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  const initializeFaceRecognition = async () => {
    setIsModelLoading(true);
    setModelError(null);
    setRecognitionMode('loading');
    
    try {
      await faceDatabase.initialize();
      const success = await faceRecognitionService.loadModels();
      
      if (success) {
        setIsModelLoading(false);
        updateAttendanceDisplay();
        const status = faceRecognitionService.getDetectionStatus();
        setDetectionStatus(status);
        setRecognitionMode(status.useSimulation ? 'simulation' : 'real');
        console.log('Face recognition initialized:', status);
      } else {
        throw new Error('Failed to load face recognition models');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      setModelError(error.message);
      setIsModelLoading(false);
      setRecognitionMode('simulation');
    }
  };

  const updateAttendanceDisplay = () => {
    const attendanceData = faceRecognitionService.getAttendanceData();
    setPresentStudents(attendanceData.present);
    setAbsentStudents(attendanceData.absent);
    setStats(attendanceData.stats);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
        startDetection();
      }
    } catch (error) {
      console.error('Camera error:', error);
      setModelError('Camera access denied. Please allow camera access.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsDetecting(false);
    
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  };

  const startDetection = () => {
    if (detectionInterval.current) return;
    
    setIsDetecting(true);
    
    detectionInterval.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        try {
          const faces = await faceRecognitionService.detectFaces(
            videoRef.current, 
            canvasRef.current
          );
          setDetectedFaces(faces);
          updateAttendanceDisplay();
        } catch (e) {
          console.error('Detection error:', e);
        }
      }
    }, 150); // Faster detection - every 150ms
  };

  const toggleCamera = () => {
    if (isStreaming) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  if (isModelLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl">
        <Loader className="w-16 h-16 text-blue-500 animate-spin mb-4" />
        <h3 className="text-xl text-white font-semibold mb-2">Loading AI Models</h3>
        <p className="text-gray-400 text-center">Initializing face recognition...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live Face Recognition</h2>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  📊 {detectionStatus?.registeredStudents || 0} students
                </span>
                <span className="flex items-center gap-1">
                  🔍 {detectionStatus?.faceDescriptorsLoaded || 0} faces loaded
                </span>
                <span className={`flex items-center gap-1 ${recognitionMode === 'real' ? 'text-green-300' : 'text-yellow-300'}`}>
                  ✓ {recognitionMode === 'real' ? 'Real-time detection active' : 'Demo mode'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleCamera}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg ${
              isStreaming
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isStreaming ? (
              <>
                <VideoOff className="w-5 h-5" />
                Stop Camera
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Start Camera
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {modelError && (
        <div className="mx-4 mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-red-300 text-sm flex-1">{modelError}</span>
          <button onClick={initializeFaceRecognition} className="text-red-300 hover:text-red-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content - Responsive Grid */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Camera Feed - Takes most of the space */}
          <div className="flex-1 min-w-0">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-inner" style={{ aspectRatio: '16/10' }}>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              
              {/* Camera Off State */}
              {!isStreaming && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                  <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border-2 border-dashed border-gray-500 animate-pulse">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Face Recognition</h3>
                  <p className="text-gray-400 mb-6 text-center px-8 max-w-sm">
                    Click Start Camera to detect and identify registered students automatically
                  </p>
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all"
                  >
                    <Zap className="w-6 h-6" />
                    Start Camera
                  </button>
                </div>
              )}

              {/* Live Overlay */}
              {isStreaming && (
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                  <div className="flex gap-2">
                    <div className="bg-red-600 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white font-bold text-sm">LIVE</span>
                    </div>
                    <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-bold">{detectedFaces.length}</span>
                      <span className="text-gray-300 text-sm">faces</span>
                    </div>
                  </div>
                  <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                    <UserCheck className="w-4 h-4 text-green-400" />
                    <span className="text-white font-bold">{stats.present}</span>
                    <span className="text-gray-300 text-sm">present</span>
                  </div>
                </div>
              )}
            </div>

            {/* Detected Faces */}
            {detectedFaces.length > 0 && (
              <div className="mt-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-sm">Detected ({detectedFaces.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detectedFaces.map((face, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                        face.isRecognized
                          ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {face.isRecognized ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {face.isRecognized ? face.name : 'Unknown'}
                      {face.isRecognized && face.confidence && (
                        <span className="text-xs opacity-70">{Math.round(face.confidence * 100)}%</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Sidebar - Compact */}
          <div className="lg:w-64 flex-shrink-0 space-y-3">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-200 mb-1" />
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-blue-200 text-xs">Total</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-3 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-200 mb-1" />
                <div className="text-2xl font-bold text-white">{stats.present}</div>
                <div className="text-green-200 text-xs">Present</div>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-xl">
                <UserX className="w-6 h-6 text-red-200 mb-1" />
                <div className="text-2xl font-bold text-white">{stats.absent}</div>
                <div className="text-red-200 text-xs">Absent</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-purple-200 mb-1" />
                <div className="text-2xl font-bold text-white">{stats.percentage}%</div>
                <div className="text-purple-200 text-xs">Rate</div>
              </div>
            </div>

            {/* Present Students */}
            <div className="bg-gray-800/80 rounded-xl p-3">
              <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-400" />
                Present ({presentStudents.length})
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {presentStudents.length === 0 ? (
                  <p className="text-gray-500 text-xs py-2 text-center">No students present yet</p>
                ) : (
                  presentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-2 p-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-white text-xs font-medium flex-1 truncate">{student.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Absent Students */}
            <div className="bg-gray-800/80 rounded-xl p-3">
              <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                <UserX className="w-4 h-4 text-red-400" />
                Absent ({absentStudents.length})
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {absentStudents.length === 0 ? (
                  <p className="text-gray-500 text-xs py-2 text-center">All present! 🎉</p>
                ) : (
                  absentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-2 p-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-white text-xs font-medium flex-1 truncate">{student.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFaceCamera;
