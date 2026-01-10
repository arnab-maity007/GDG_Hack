import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Video, LayoutDashboard, BookOpen, Users, Brain, Camera, Mic, Eye, TrendingUp, Shield, Wifi, WifiOff } from 'lucide-react';
import { liveDataService } from '../services/LiveDataService';

export const MainLanding = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [todaySummary, setTodaySummary] = useState(liveDataService.getTodaySummary());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const interval = setInterval(() => setTodaySummary(liveDataService.getTodaySummary()), 5000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: <LayoutDashboard className="w-12 h-12" />,
      title: "EduPulse AI Dashboard",
      description: "Comprehensive analytics for administrators, teachers, and students. Track engagement, performance, and insights.",
      path: "/login",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      icon: <Video className="w-12 h-12" />,
      title: "Live Classroom Monitor",
      description: "Real-time facial attendance, teacher topic validation, and student engagement tracking. Works OFFLINE!",
      path: "/classroom",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    }
  ];

  const offlineCapabilities = [
    { icon: <Camera className="w-8 h-8" />, title: "Facial Attendance", desc: "Scan faces without internet" },
    { icon: <Mic className="w-8 h-8" />, title: "Voice Monitoring", desc: "Track teacher topics offline" },
    { icon: <Eye className="w-8 h-8" />, title: "Behavior Tracking", desc: "ML-powered engagement analysis" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EduPulse AI</h1>
                <p className="text-xs text-gray-600">Smart Attendance & Monitoring System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline Mode'}</span>
              </div>
              <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Works 100% Offline - No Internet Required!</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Smart Attendance for Indian Schools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Facial recognition attendance, teacher topic monitoring, and student engagement tracking - 
            all designed for schools up to Class 10 with <strong className="text-blue-600">zero internet dependency</strong>.
          </p>
        </div>

        {/* Live Stats Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{todaySummary.studentsTracked || 0}</p>
              <p className="text-xs text-blue-700">Students Tracked Today</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{todaySummary.attendanceSessions || 0}</p>
              <p className="text-xs text-green-700">Attendance Sessions</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{todaySummary.teacherSessions || 0}</p>
              <p className="text-xs text-purple-700">Teacher Sessions</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{todaySummary.averageEngagement?.toFixed(0) || '--'}%</p>
              <p className="text-xs text-orange-700">Avg Engagement</p>
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className={`${feature.color} p-6 text-white`}>
                <div className="flex items-center space-x-4">
                  {feature.icon}
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg mb-4">{feature.description}</p>
                <button 
                  className={`w-full ${feature.color} ${feature.hoverColor} text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300`}
                >
                  Launch Application →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Key Capabilities */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-2 text-gray-900">Offline-First Capabilities</h3>
          <p className="text-center text-gray-600 mb-6">All core features work without internet connection</p>
          <div className="grid md:grid-cols-3 gap-6">
            {offlineCapabilities.map((cap, idx) => (
              <div key={idx} className="text-center p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-blue-100">
                <div className="text-blue-600 mx-auto mb-4 flex justify-center">{cap.icon}</div>
                <h4 className="font-bold text-lg mb-2">{cap.title}</h4>
                <p className="text-gray-600 text-sm">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">Three Pillars of Classroom Intelligence</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border-l-4 border-blue-500 bg-blue-50 rounded-r-xl">
              <Camera className="w-10 h-10 mb-4 text-blue-600" />
              <h4 className="font-bold text-xl mb-2 text-blue-900">Facial Attendance</h4>
              <p className="text-blue-800 text-sm mb-3">
                Automatic attendance using classroom cameras. Students are recognized and marked present instantly.
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>✓ Works completely offline</li>
                <li>✓ Privacy-first design</li>
                <li>✓ Syncs when online</li>
              </ul>
            </div>
            <div className="p-6 border-l-4 border-purple-500 bg-purple-50 rounded-r-xl">
              <Mic className="w-10 h-10 mb-4 text-purple-600" />
              <h4 className="font-bold text-xl mb-2 text-purple-900">Teacher Monitoring</h4>
              <p className="text-purple-800 text-sm mb-3">
                Validates if teacher is teaching the assigned curriculum topic using speech recognition.
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>✓ On-topic percentage tracking</li>
                <li>✓ Improvement suggestions</li>
                <li>✓ Session reports & grades</li>
              </ul>
            </div>
            <div className="p-6 border-l-4 border-green-500 bg-green-50 rounded-r-xl">
              <Brain className="w-10 h-10 mb-4 text-green-600" />
              <h4 className="font-bold text-xl mb-2 text-green-900">Future Capability Prediction</h4>
              <p className="text-green-800 text-sm mb-3">
                Tracks student behavior over 6-12 months to predict interests and future career paths.
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>✓ Interest pattern analysis</li>
                <li>✓ Hand raise frequency</li>
                <li>✓ Career path suggestions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Powered by Advanced Technology</h3>
          <p className="text-lg mb-6">
            Built with React, Vite, TailwindCSS, Roboflow AI, and Express.js for a seamless, intelligent educational experience
          </p>
          <div className="flex justify-center space-x-4">
            <span className="bg-white/20 px-4 py-2 rounded-lg">React</span>
            <span className="bg-white/20 px-4 py-2 rounded-lg">AI/ML</span>
            <span className="bg-white/20 px-4 py-2 rounded-lg">Real-time Analytics</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2026 EduPulse AI - GDG Hackathon Project</p>
          <p className="text-gray-500 text-sm mt-2">Transforming education through artificial intelligence</p>
        </div>
      </footer>
    </div>
  );
};
