import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockTeachers, mockSystemReport, mockStudents } from '../../utils/mockData';
import { StatCard } from '../../components/StatCard';
import { TrendingUp, Users, CheckCircle, AlertCircle, Video, Bell, Activity } from 'lucide-react';
import { liveDataService } from '../../services/LiveDataService';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(liveDataService.getSystemMetrics());
  const [todaySummary, setTodaySummary] = useState(liveDataService.getTodaySummary());
  const [alerts, setAlerts] = useState(liveDataService.getAlerts(5));

  useEffect(() => {
    const unsubMetrics = liveDataService.subscribe('systemMetrics', setMetrics);
    const unsubAlerts = liveDataService.subscribe('alerts', () => setAlerts(liveDataService.getAlerts(5)));
    
    // Update today's summary periodically
    const interval = setInterval(() => setTodaySummary(liveDataService.getTodaySummary()), 10000);
    
    return () => {
      unsubMetrics();
      unsubAlerts();
      clearInterval(interval);
    };
  }, []);

  const report = { ...mockSystemReport, ...metrics };
  const exemplaryPercentage = Math.round((report.exemplaryTeachers / report.totalTeachers) * 100);

  const statusData = [
    { name: 'Exemplary', value: report.exemplaryTeachers, fill: '#059669' },
    { name: 'Needs Improvement', value: report.needsImprovementTeachers, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Admin Dashboard</h1>
        <p className="text-edu-slate mt-1">School-wide performance overview and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Teachers"
          value={report.totalTeachers}
          subtitle="Active educators"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Exemplary Teachers"
          value={`${exemplaryPercentage}%`}
          subtitle={`${report.exemplaryTeachers} teachers`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Average Quality"
          value={`${report.averageTeacherQuality.toFixed(1)}%`}
          subtitle="On-topic average"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="At-Risk Items"
          value={report.needsImprovementTeachers + 1}
          subtitle="Below 75% threshold"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Quality Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={report.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#1e40af" 
                strokeWidth={2}
                dot={{ fill: '#1e40af', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Teacher Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Teacher Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                labelStyle={{ color: '#0f172a' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border-l-4 border-edu-green">
          <p className="text-edu-slate text-sm font-medium">Productive Classes</p>
          <p className="text-4xl font-bold text-edu-green mt-2">{report.classesProductive}</p>
          <p className="text-edu-slate text-xs mt-1">meeting engagement goals</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-md p-6 border-l-4 border-edu-blue">
          <p className="text-edu-slate text-sm font-medium">Average Student Engagement</p>
          <p className="text-4xl font-bold text-edu-blue mt-2">{(report.averageEngagement || report.averageStudentEngagement || 0).toFixed(1)}%</p>
          <p className="text-edu-slate text-xs mt-1">across all classes</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-edu-slate text-sm font-medium">Classes Needing Improvement</p>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{report.classesNeedImprovement}</p>
          <p className="text-edu-slate text-xs mt-1">action required</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/classroom')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <Video className="w-5 h-5" />
            <span className="font-semibold">Open Live Monitor</span>
          </button>
          <button 
            onClick={() => navigate('/admin/alerts')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
          >
            <Bell className="w-5 h-5" />
            <span className="font-semibold">View All Alerts ({alerts.length})</span>
          </button>
          <button 
            onClick={() => navigate('/admin/report')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
          >
            <Activity className="w-5 h-5" />
            <span className="font-semibold">Generate Report</span>
          </button>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Today's Activity Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600">{todaySummary.attendanceSessions}</p>
            <p className="text-sm text-blue-700">Attendance Sessions</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-600">{todaySummary.studentsTracked}</p>
            <p className="text-sm text-green-700">Students Tracked</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-600">{todaySummary.teacherSessions}</p>
            <p className="text-sm text-purple-700">Teacher Sessions</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-orange-600">{todaySummary.alerts}</p>
            <p className="text-sm text-orange-700">Alerts Today</p>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Recent Alerts</h2>
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div key={alert.id || idx} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'bg-red-50 border-red-500' : 
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' : 
                'bg-blue-50 border-blue-500'
              }`}>
                <p className="font-medium text-gray-800">{alert.message || alert.title}</p>
                <p className="text-sm text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
