import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockStudents } from '../../utils/mockData';
import { StatCard } from '../../components/StatCard';
import { TrendingUp, Calendar, Zap, Target } from 'lucide-react';

export const StudentDashboard = () => {
  // Using first student (Alex Thompson)
  const student = mockStudents[0];

  const progressData = [
    { week: 'Week 1', attendance: 88, engagement: 80 },
    { week: 'Week 2', attendance: 90, engagement: 82 },
    { week: 'Week 3', attendance: 92, engagement: 85 },
    { week: 'Week 4', attendance: 94, engagement: 87 },
    { week: 'Week 5', attendance: 94, engagement: 87 },
  ];

  const getProgressTowardGoal = () => {
    return Math.min(100, ((student.attendancePercentage + student.engagementPercentage) / 2 / 75) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">My Learning Dashboard</h1>
        <p className="text-edu-slate mt-1">Track your progress toward learning goals</p>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-edu-blue to-blue-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome, {student.name}!</h2>
        <p className="text-white/80 mt-2">Grade {student.grade} | Keep up the great work! 🎉</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${student.attendancePercentage}%`}
          subtitle="Current session"
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Engagement Level"
          value={`${student.engagementPercentage}%`}
          subtitle="Active participation"
          icon={Zap}
          color="blue"
        />
        <StatCard
          title="Progress to Goal"
          value={`${getProgressTowardGoal().toFixed(0)}%`}
          subtitle="Toward 75% target"
          icon={Target}
          color="green"
        />
        <StatCard
          title="Status"
          value={student.status}
          subtitle="Performing well"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-3">Attendance Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-edu-light-slate rounded-full h-4">
                <div className="bg-edu-green h-4 rounded-full" style={{ width: `${student.attendancePercentage}%` }}></div>
              </div>
              <p className="text-sm text-edu-slate mt-2">{student.attendancePercentage}% - {student.attendancePercentage >= 75 ? '✓ Exceeds goal' : '⚠ Below goal'}</p>
            </div>
            <p className="text-2xl font-bold text-edu-dark-blue min-w-16 text-right">{student.attendancePercentage}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-3">Engagement Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-edu-light-slate rounded-full h-4">
                <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${student.engagementPercentage}%` }}></div>
              </div>
              <p className="text-sm text-edu-slate mt-2">{student.engagementPercentage}% - {student.engagementPercentage >= 75 ? '✓ Exceeds goal' : '⚠ Below goal'}</p>
            </div>
            <p className="text-2xl font-bold text-edu-dark-blue min-w-16 text-right">{student.engagementPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Your Weekly Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" stroke="#475569" />
            <YAxis stroke="#475569" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#059669" 
              strokeWidth={2}
              dot={{ fill: '#059669', r: 4 }}
              name="Attendance"
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#1e40af" 
              strokeWidth={2}
              dot={{ fill: '#1e40af', r: 4 }}
              name="Engagement"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Motivational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-edu-light-green rounded-lg shadow-md p-6 border-l-4 border-edu-green">
          <h3 className="font-bold text-edu-dark-blue mb-2">🌟 Strengths</h3>
          <ul className="space-y-1 text-sm text-edu-dark-blue">
            <li>✓ Excellent attendance record</li>
            <li>✓ Strong engagement in class</li>
            <li>✓ Consistent upward trend</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-edu-blue">
          <h3 className="font-bold text-edu-dark-blue mb-2">💡 Next Steps</h3>
          <ul className="space-y-1 text-sm text-edu-dark-blue">
            <li>• Maintain attendance goal</li>
            <li>• Participate in class discussions</li>
            <li>• Explore interest areas further</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
