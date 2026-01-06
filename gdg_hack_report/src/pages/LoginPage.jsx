import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { demoUsers } from '../utils/mockData';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email or ID');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Find user in demo data
      const user = demoUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        login(user.name, user.role);
        navigate(`/${user.role}/dashboard`);
      } else {
        setError('Invalid email/ID or password');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleDemoLogin = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-edu-dark-blue via-edu-blue to-edu-blue flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-4">
            <span className="text-edu-green font-semibold text-sm">🔐 Secure Login</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">EduPulse AI</h1>
          <p className="text-white/80 text-lg">
            Advanced Classroom Monitoring & Analytics Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email/ID Input */}
            <div>
              <label className="block text-sm font-semibold text-edu-dark-blue mb-2">
                Email / ID
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-edu-slate" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email or ID"
                  className="w-full pl-12 pr-4 py-3 border-2 border-edu-light-slate rounded-lg focus:outline-none focus:border-edu-green transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-edu-dark-blue mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-edu-slate" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-edu-light-slate rounded-lg focus:outline-none focus:border-edu-green transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-edu-slate hover:text-edu-dark-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-edu-green to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-8 pt-8 border-t border-edu-light-slate">
            <p className="text-sm font-semibold text-edu-dark-blue mb-4">
              Demo Credentials (Click to Auto-fill):
            </p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user)}
                  className="w-full text-left p-3 rounded-lg border-2 border-edu-light-slate hover:border-edu-green hover:bg-edu-light-green/20 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-edu-dark-blue text-sm">{user.name}</p>
                      <p className="text-xs text-edu-slate">{user.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-edu-blue text-white rounded text-xs font-semibold capitalize">
                      {user.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-edu-slate mt-3">
              💡 <span className="font-semibold">Tip:</span> Click any demo user to auto-fill credentials. Password is same as shown in system.
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">🔒 Note:</span> This is a demo system. Use provided demo credentials for testing. In production, connect to a real authentication server.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60 text-sm">
          <p>Secure • Role-Based Access • Real-time Analytics</p>
        </div>
      </div>
    </div>
  );
};
