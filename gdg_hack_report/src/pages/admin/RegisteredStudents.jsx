// RegisteredStudents.jsx - Admin page to view and manage all registered students
import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Trash2, Camera, 
  CheckCircle, XCircle, RefreshCw, Download,
  Eye, User, GraduationCap, Calendar, Image
} from 'lucide-react';
import { faceDatabase } from '../../services/FaceDatabase';
import { faceRecognitionService } from '../../services/FaceRecognitionService';
import StudentPhotoUpload from '../../components/StudentPhotoUpload';

export const RegisteredStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [faceStatus, setFaceStatus] = useState(null);

  // Load students on mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      await faceDatabase.initialize();
      await faceRecognitionService.loadModels();
      
      const allStudents = faceDatabase.getAllStudents();
      setStudents(allStudents);
      
      const status = faceRecognitionService.getDetectionStatus();
      setFaceStatus(status);
    } catch (error) {
      console.error('Error loading students:', error);
    }
    setLoading(false);
  };

  // Filter students by search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle student added
  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    setShowAddModal(false);
    loadStudents(); // Refresh to get updated face status
  };

  // Handle delete student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await faceDatabase.deleteStudent(studentId);
        setStudents(prev => prev.filter(s => s.id !== studentId));
        // Rebuild face matcher
        await faceRecognitionService.buildFaceMatcher();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  // Export students list
  const exportStudentsList = () => {
    const data = students.map(s => ({
      name: s.name,
      grade: s.grade,
      rollNo: s.rollNo,
      registeredAt: s.registeredAt,
      hasFaceData: s.faceDescriptors?.length > 0
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registered_students.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading registered students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-edu-dark-blue flex items-center gap-3">
            <Users className="w-8 h-8" />
            Registered Students
          </h1>
          <p className="text-edu-slate mt-1">
            Manage student face registrations for attendance tracking
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadStudents}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportStudentsList}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-edu-green hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-md"
          >
            <UserPlus className="w-5 h-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Face Data Ready</p>
              <p className="text-2xl font-bold text-gray-800">
                {students.filter(s => s.faceDescriptors?.length > 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Setup</p>
              <p className="text-2xl font-bold text-gray-800">
                {students.filter(s => !s.faceDescriptors || s.faceDescriptors.length === 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">AI Detection</p>
              <p className="text-lg font-bold text-gray-800">
                {faceStatus?.useSimulation ? 'Demo Mode' : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name, grade, or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Student</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Grade</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Roll No</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Face Data</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Registered</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">
                        {searchTerm ? 'No students found matching your search' : 'No students registered yet'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Add your first student →
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-500">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        <GraduationCap className="w-4 h-4" />
                        {student.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-mono">
                      {student.rollNo || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {student.faceDescriptors && student.faceDescriptors.length > 0 ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Ready ({student.faceDescriptors.length} sample{student.faceDescriptors.length > 1 ? 's' : ''})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          No Face Data
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {student.registeredAt ? new Date(student.registeredAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <StudentPhotoUpload 
              onStudentAdded={handleStudentAdded}
              onClose={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Student Details</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h4>
                  <p className="text-gray-500">{selectedStudent.grade || 'No Grade'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Roll Number</p>
                  <p className="font-semibold text-gray-800">{selectedStudent.rollNo || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-gray-800">{selectedStudent.status || 'Active'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Face Samples</p>
                  <p className="font-semibold text-gray-800">{selectedStudent.faceDescriptors?.length || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Photos</p>
                  <p className="font-semibold text-gray-800">{selectedStudent.photos?.length || 0}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Student ID</p>
                <p className="font-mono text-sm text-gray-800 break-all">{selectedStudent.id}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Registered Date</p>
                <p className="font-semibold text-gray-800">
                  {selectedStudent.registeredAt ? new Date(selectedStudent.registeredAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredStudents;
