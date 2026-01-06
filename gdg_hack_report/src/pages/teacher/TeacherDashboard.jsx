import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockClassAnalytics, mockTeachers } from '../../utils/mockData';
import { StatCard } from '../../components/StatCard';
import { Clock, Users, TrendingUp, Zap } from 'lucide-react';

export const TeacherDashboard = () => {
  const currentTeacher = mockTeachers[0]; // Dr. Sarah Johnson
  const analytics = mockClassAnalytics;

  const colors = ['#059669', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Teacher Dashboard</h1>
        <p className="text-edu-slate mt-1">Current lecture analytics and insights</p>
      </div>

      {/* Current Session Info */}
      <div className="bg-gradient-to-r from-edu-blue to-blue-600 rounded-lg shadow-md p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-white/80 text-sm">Current Lecture</p>
            <p className="text-2xl font-bold mt-1">{analytics.currentLecture.topic}</p>
            <p className="text-white/60 text-sm mt-1">{analytics.currentLecture.subject}</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Duration</p>
            <p className="text-2xl font-bold mt-1">{analytics.currentLecture.duration} min</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Overall Performance</p>
            <p className="text-2xl font-bold mt-1">82%</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="On-Topic Time"
          value={`${analytics.currentLecture.onTopic}/${analytics.currentLecture.duration}`}
          subtitle={`${Math.round((analytics.currentLecture.onTopic / analytics.currentLecture.duration) * 100)}% of lecture`}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Avg Student Engagement"
          value="81%"
          subtitle="Good participation level"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Curriculum Coverage"
          value={`${currentTeacher.curriculumCovered}%`}
          subtitle="Session objectives met"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Quality Score"
          value={`${currentTeacher.onTopicPercentage}%`}
          subtitle="Meeting excellence standards"
          icon={Zap}
          color="blue"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* On-Topic vs Off-Topic */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Lecture Focus Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.currentLecture.topicBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="topic" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Bar dataKey="value" name="Minutes" radius={[8, 8, 0, 0]}>
                {analytics.currentLecture.topicBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentTeacher.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-3">✅ Strengths</h3>
          <ul className="space-y-2 text-sm text-edu-dark-blue">
            <li>• Maintaining excellent on-topic focus (82%)</li>
            <li>• Students highly engaged in core content</li>
            <li>• Consistent curriculum coverage (95%)</li>
            <li>• Exemplary teaching quality achieved</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-3">💡 Recommendations</h3>
          <ul className="space-y-2 text-sm text-edu-dark-blue">
            <li>• Consider interactive activities for off-topic breaks</li>
            <li>• Maintain current momentum in next session</li>
            <li>• Monitor less-engaged students closely</li>
            <li>• Share techniques with other educators</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
