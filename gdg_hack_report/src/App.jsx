import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherOversight } from './pages/admin/TeacherOversight';
import { SystemReport } from './pages/admin/SystemReport';
import { AlertSystem } from './pages/admin/AlertSystem';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { ClassAnalytics } from './pages/teacher/ClassAnalytics';
import { StudentInterests } from './pages/teacher/StudentInterests';
import { EngagementTracker } from './pages/teacher/EngagementTracker';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { InterestRadar } from './pages/student/InterestRadar';
import { FutureCapability } from './pages/student/FutureCapability';
import { ProgressTracker } from './pages/student/ProgressTracker';

import './index.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-edu-light-slate/30">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/teachers" element={<TeacherOversight />} />
                    <Route path="/report" element={<SystemReport />} />
                    <Route path="/alerts" element={<AlertSystem />} />
                    <Route path="/" element={<AdminDashboard />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute requiredRole="teacher">
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<TeacherDashboard />} />
                    <Route path="/analytics" element={<ClassAnalytics />} />
                    <Route path="/interests" element={<StudentInterests />} />
                    <Route path="/engagement" element={<EngagementTracker />} />
                    <Route path="/" element={<TeacherDashboard />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/interests" element={<InterestRadar />} />
                    <Route path="/future" element={<FutureCapability />} />
                    <Route path="/progress" element={<ProgressTracker />} />
                    <Route path="/" element={<StudentDashboard />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
