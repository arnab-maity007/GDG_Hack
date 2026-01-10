// StudentPhotoUpload.jsx - Upload and register student photos
import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, Camera, User, X, Check, Loader, 
  Image, UserPlus, AlertCircle, CheckCircle
} from 'lucide-react';
import { faceRecognitionService } from '../services/FaceRecognitionService';
import { faceDatabase } from '../services/FaceDatabase';

const StudentPhotoUpload = ({ onStudentAdded, onClose }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: Photo, 3: Confirm
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    grade: '10A',
    email: ''
  });
  const [photoData, setPhotoData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Handle file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoData(e.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // Start camera for capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
        setIsCameraMode(true);
      }
    } catch (err) {
      setError('Could not access camera. Please try uploading a photo instead.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsCameraMode(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPhotoData(dataUrl);
    stopCamera();
    setError(null);
  };

  // Register student
  const handleRegister = async () => {
    if (!studentInfo.name.trim()) {
      setError('Please enter student name');
      return;
    }
    
    if (!photoData) {
      setError('Please upload or capture a photo');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Add student with photo
      const student = await faceRecognitionService.addNewStudent(
        studentInfo.name,
        studentInfo.grade,
        photoData
      );

      setSuccess(true);
      
      if (onStudentAdded) {
        onStudentAdded(student);
      }

      // Reset after success
      setTimeout(() => {
        setStudentInfo({ name: '', grade: '10A', email: '' });
        setPhotoData(null);
        setStep(1);
        setSuccess(false);
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to register student');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear photo
  const clearPhoto = () => {
    setPhotoData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Add New Student</h3>
            <p className="text-gray-400 text-sm">Register face for attendance</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-green-400 font-medium">Student Registered!</p>
            <p className="text-green-300 text-sm">Face has been added to the database.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Step Progress */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-colors ${
              step >= s ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Student Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Student Name *</label>
            <input
              type="text"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Grade/Class</label>
            <select
              value={studentInfo.grade}
              onChange={(e) => setStudentInfo({ ...studentInfo, grade: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {['9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Email (Optional)</label>
            <input
              type="email"
              value={studentInfo.email}
              onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="student@school.edu"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!studentInfo.name.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            Next: Add Photo
            <Camera className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Photo Upload/Capture */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Photo Preview */}
          <div className="relative aspect-square bg-gray-700 rounded-xl overflow-hidden">
            {photoData ? (
              <>
                <img
                  src={photoData}
                  alt="Student photo"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : isCameraMode ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <User className="w-20 h-20 text-gray-500 mb-4" />
                <p className="text-gray-400 text-center px-4">
                  Upload a clear photo of the student's face
                </p>
              </div>
            )}
          </div>

          {/* Photo Actions */}
          {!photoData && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload
              </button>
              {isCameraMode && isStreaming ? (
                <button
                  onClick={capturePhoto}
                  className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Capture
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Camera
                </button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                stopCamera();
                setStep(1);
              }}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!photoData}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium"
            >
              Next: Confirm
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Preview Card */}
          <div className="bg-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={photoData}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{studentInfo.name}</h4>
                <p className="text-gray-400">Grade: {studentInfo.grade}</p>
                {studentInfo.email && (
                  <p className="text-gray-400 text-sm">{studentInfo.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-400 text-sm">
              <strong>Note:</strong> The face will be registered and used for automatic 
              attendance tracking. Make sure the photo clearly shows the student's face.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              disabled={isProcessing}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={handleRegister}
              disabled={isProcessing}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPhotoUpload;
