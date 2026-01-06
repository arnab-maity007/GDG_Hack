import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockSystemReport } from '../../utils/mockData';
import { StatCard } from '../../components/StatCard';
import { BarChart3, Users, TrendingUp, Award } from 'lucide-react';

export const SystemReport = () => {
  const report = mockSystemReport;

  const classPerformanceData = [
    { name: 'Class 10A', quality: 82, engagement: 87, productivity: 85 },
    { name: 'Class 10B', quality: 68, engagement: 72, productivity: 65 },
    { name: 'Class 10C', quality: 88, engagement: 85, productivity: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">System Report</h1>
        <p className="text-edu-slate mt-1">Global view of school efficiency and performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={report.totalStudents}
          subtitle="Active learners"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Students"
          value={`${Math.round((report.activeStudents / report.totalStudents) * 100)}%`}
          subtitle={`${report.activeStudents} students`}
          icon={Award}
          color="green"
        />
        <StatCard
          title="System Average Quality"
          value={`${report.averageTeacherQuality.toFixed(1)}%`}
          subtitle="Teaching excellence"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Engagement Rate"
          value={`${report.averageStudentEngagement.toFixed(1)}%`}
          subtitle="Overall participation"
          icon={BarChart3}
          color="green"
        />
      </div>

      {/* Class Performance Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Class Performance Comparison</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={classPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#475569" />
            <YAxis stroke="#475569" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
            />
            <Legend />
            <Bar dataKey="quality" fill="#1e40af" name="Quality %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="engagement" fill="#059669" name="Engagement %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="productivity" fill="#f59e0b" name="Productivity %" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">School-Wide Trend Analysis</h2>
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
              strokeWidth={3}
              dot={{ fill: '#1e40af', r: 5 }}
              activeDot={{ r: 7 }}
              name="Teaching Quality"
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#059669" 
              strokeWidth={3}
              dot={{ fill: '#059669', r: 5 }}
              activeDot={{ r: 7 }}
              name="Student Engagement"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-3">Productive & Fruitful Classes</h3>
          <p className="text-3xl font-bold text-edu-green mb-2">{report.classesProductive}/3</p>
          <ul className="space-y-2 text-sm text-edu-dark-blue">
            <li>✓ Class 10A: Exemplary performance</li>
            <li>✓ Class 10C: Exceeding targets</li>
            <li className="text-yellow-700">⚠ Class 10B: Needs attention</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-3">Key Recommendations</h3>
          <ul className="space-y-2 text-sm text-edu-dark-blue">
            <li>• Provide coaching for below-threshold teachers</li>
            <li>• Recognize exemplary teacher practices</li>
            <li>• Implement support for at-risk students</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
