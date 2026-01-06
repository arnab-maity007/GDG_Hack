import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockTeachers, mockSystemReport, mockStudents } from '../../utils/mockData';
import { StatCard } from '../../components/StatCard';
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const report = mockSystemReport;
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
          <p className="text-4xl font-bold text-edu-blue mt-2">{report.averageStudentEngagement.toFixed(1)}%</p>
          <p className="text-edu-slate text-xs mt-1">across all classes</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-edu-slate text-sm font-medium">Classes Needing Improvement</p>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{report.classesNeedImprovement}</p>
          <p className="text-edu-slate text-xs mt-1">action required</p>
        </div>
      </div>
    </div>
  );
};
