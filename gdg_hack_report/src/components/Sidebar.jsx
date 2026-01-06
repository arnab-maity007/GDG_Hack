import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Teacher Oversight', path: '/admin/teachers' },
          { label: 'System Report', path: '/admin/report' },
          { label: 'Alerts', path: '/admin/alerts' },
        ];
      case 'teacher':
        return [
          { label: 'Dashboard', path: '/teacher/dashboard' },
          { label: 'Class Analytics', path: '/teacher/analytics' },
          { label: 'Student Interests', path: '/teacher/interests' },
          { label: 'Engagement Tracker', path: '/teacher/engagement' },
        ];
      case 'student':
        return [
          { label: 'Dashboard', path: '/student/dashboard' },
          { label: 'Interest Radar', path: '/student/interests' },
          { label: 'Future Capability', path: '/student/future' },
          { label: 'Progress Tracker', path: '/student/progress' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-edu-dark-blue text-white p-2 rounded"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-edu-dark-blue text-white transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-edu-green mb-2">EduPulse AI</h1>
          <p className="text-edu-light-slate text-sm">Classroom Monitoring</p>
        </div>

        <nav className="px-4 py-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded mb-2 transition-colors ${
                isActive(item.path)
                  ? 'bg-edu-green text-white'
                  : 'text-edu-light-slate hover:bg-edu-slate/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="mb-4 p-3 bg-edu-slate/30 rounded">
            <p className="text-sm text-edu-light-slate">Logged in as</p>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-edu-light-slate capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
