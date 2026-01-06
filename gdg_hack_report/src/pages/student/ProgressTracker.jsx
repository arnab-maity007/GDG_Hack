import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockStudents } from '../../utils/mockData';

export const ProgressTracker = () => {
  const student = mockStudents[0];

  const monthlyProgress = [
    { month: 'September', attendance: 85, engagement: 78, gpa: 3.7 },
    { month: 'October', attendance: 88, engagement: 80, gpa: 3.75 },
    { month: 'November', attendance: 90, engagement: 83, gpa: 3.82 },
    { month: 'December', attendance: 92, engagement: 85, gpa: 3.88 },
    { month: 'January', attendance: 94, engagement: 87, gpa: 3.92 },
  ];

  const subjectPerformance = [
    { subject: 'Math', score: 92, target: 85 },
    { subject: 'Science', score: 88, target: 85 },
    { subject: 'English', score: 85, target: 85 },
    { subject: 'History', score: 82, target: 80 },
    { subject: 'Art', score: 88, target: 75 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Progress Tracker</h1>
        <p className="text-edu-slate mt-1">Monitor your academic progress and improvements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-edu-green">
          <p className="text-edu-slate text-sm font-medium">Current Attendance</p>
          <p className="text-3xl font-bold text-edu-dark-blue mt-2">{student.attendancePercentage}%</p>
          <p className="text-edu-slate text-xs mt-2">↑ Up from 85% (September)</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <p className="text-edu-slate text-sm font-medium">Current Engagement</p>
          <p className="text-3xl font-bold text-edu-dark-blue mt-2">{student.engagementPercentage}%</p>
          <p className="text-edu-slate text-xs mt-2">↑ Up from 78% (September)</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-edu-slate text-sm font-medium">Estimated GPA</p>
          <p className="text-3xl font-bold text-edu-dark-blue mt-2">3.92</p>
          <p className="text-edu-slate text-xs mt-2">↑ Up from 3.7 (September)</p>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Monthly Progress Trend</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#475569" />
            <YAxis stroke="#475569" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value}${typeof value === 'number' && value < 5 ? '' : '%'}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#059669" 
              strokeWidth={2}
              dot={{ fill: '#059669', r: 4 }}
              name="Attendance %"
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#1e40af" 
              strokeWidth={2}
              dot={{ fill: '#1e40af', r: 4 }}
              name="Engagement %"
            />
            <Line 
              type="monotone" 
              dataKey="gpa" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
              name="GPA"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Subject Performance vs. Target</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="subject" stroke="#475569" />
            <YAxis stroke="#475569" domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Bar dataKey="score" fill="#059669" name="Actual Score" radius={[8, 8, 0, 0]} />
            <Bar dataKey="target" fill="#cbd5e1" name="Target Score" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Achievement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-4">🏆 Achievements This Semester</h3>
          <ul className="space-y-2 text-sm text-edu-dark-blue">
            <li>✓ Perfect attendance month (December)</li>
            <li>✓ Improved engagement by 9%</li>
            <li>✓ GPA above 3.9 mark</li>
            <li>✓ Exceeded targets in all subjects</li>
            <li>✓ Consistent upward trend</li>
            <li>✓ Participated in 3 competitions</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-blue-900 mb-4">📚 Learning Goals</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Maintain 95%+ attendance (Goal: ✓ Achieved)</li>
            <li>✓ Keep engagement above 85% (Goal: ✓ Achieved)</li>
            <li>✓ Score 90+ in all subjects (Goal: On track)</li>
            <li>✓ Reach GPA 4.0 (Goal: In progress)</li>
            <li>✓ Lead 1 group project (Goal: In progress)</li>
            <li>✓ Participate in science fair (Goal: Upcoming)</li>
          </ul>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-edu-dark-blue text-white">
          <h3 className="font-bold">Detailed Progress Metrics</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-edu-light-slate bg-edu-light-slate/50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Metric</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">September</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">January</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Change</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-edu-light-slate hover:bg-edu-light-slate/20">
              <td className="px-6 py-4 text-sm font-semibold text-edu-dark-blue">Attendance</td>
              <td className="px-6 py-4 text-center text-sm text-edu-slate">85%</td>
              <td className="px-6 py-4 text-center text-sm font-semibold text-edu-dark-blue">94%</td>
              <td className="px-6 py-4 text-center text-sm text-edu-green font-semibold">+9%</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 bg-edu-green text-white rounded text-xs font-semibold">Excellent</span>
              </td>
            </tr>
            <tr className="border-b border-edu-light-slate hover:bg-edu-light-slate/20">
              <td className="px-6 py-4 text-sm font-semibold text-edu-dark-blue">Engagement</td>
              <td className="px-6 py-4 text-center text-sm text-edu-slate">78%</td>
              <td className="px-6 py-4 text-center text-sm font-semibold text-edu-dark-blue">87%</td>
              <td className="px-6 py-4 text-center text-sm text-edu-green font-semibold">+9%</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 bg-edu-green text-white rounded text-xs font-semibold">Strong</span>
              </td>
            </tr>
            <tr className="border-b border-edu-light-slate hover:bg-edu-light-slate/20">
              <td className="px-6 py-4 text-sm font-semibold text-edu-dark-blue">GPA</td>
              <td className="px-6 py-4 text-center text-sm text-edu-slate">3.70</td>
              <td className="px-6 py-4 text-center text-sm font-semibold text-edu-dark-blue">3.92</td>
              <td className="px-6 py-4 text-center text-sm text-edu-green font-semibold">+0.22</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 bg-edu-green text-white rounded text-xs font-semibold">Outstanding</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
