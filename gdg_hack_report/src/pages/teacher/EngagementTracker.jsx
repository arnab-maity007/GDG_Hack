import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockClassAnalytics, mockStudents } from '../../utils/mockData';
import { TrendingUp, AlertCircle } from 'lucide-react';

export const EngagementTracker = () => {
  const analytics = mockClassAnalytics;

  const getCapabilityColor = (capability) => {
    if (capability >= 80) return 'bg-edu-green text-white';
    if (capability >= 70) return 'bg-blue-600 text-white';
    if (capability >= 60) return 'bg-yellow-600 text-white';
    return 'bg-red-600 text-white';
  };

  const getStatusBadge = (engagement) => {
    if (engagement >= 80) return { label: 'Highly Engaged', color: 'bg-edu-green text-white' };
    if (engagement >= 70) return { label: 'Engaged', color: 'bg-blue-600 text-white' };
    if (engagement >= 60) return { label: 'Moderately Engaged', color: 'bg-yellow-600 text-white' };
    return { label: 'Needs Support', color: 'bg-red-600 text-white' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Engagement Tracker</h1>
        <p className="text-edu-slate mt-1">Student engagement levels and future capability assessment</p>
      </div>

      {/* Engagement Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Student Engagement Overview</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.engagementByStudent}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#475569" />
            <YAxis stroke="#475569" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Bar dataKey="engagement" fill="#1e40af" name="Engagement %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="futureCapability" fill="#059669" name="Future Capability %" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Student Engagement List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-edu-dark-blue text-white">
          <h3 className="font-bold">Student-by-Student Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-edu-light-slate bg-edu-light-slate/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Student Name</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Engagement %</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Future Capability</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Notes</th>
              </tr>
            </thead>
            <tbody>
              {analytics.engagementByStudent.map((student, idx) => {
                const status = getStatusBadge(student.engagement);
                return (
                  <tr key={idx} className="border-b border-edu-light-slate hover:bg-edu-light-slate/20">
                    <td className="px-6 py-4 text-sm font-semibold text-edu-dark-blue">{student.name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 bg-edu-light-slate rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.engagement}%` }}></div>
                        </div>
                        <span className="font-bold text-edu-dark-blue min-w-10">{student.engagement}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCapabilityColor(student.futureCapability)}`}>
                        {student.futureCapability}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-edu-slate">
                      {student.engagement >= 80 ? (
                        <span className="text-edu-green font-semibold">✓ Excellent participation</span>
                      ) : student.engagement < 60 ? (
                        <span className="flex items-center gap-1 text-red-600"><AlertCircle size={14} /> Needs support</span>
                      ) : (
                        <span className="text-yellow-700">Solid contribution</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-4">⭐ Star Students</h3>
          <ul className="space-y-3">
            {analytics.engagementByStudent.filter(s => s.engagement >= 80).map((student, idx) => (
              <li key={idx} className="pb-2 border-b border-green-200">
                <p className="font-semibold text-edu-dark-blue">{student.name}</p>
                <p className="text-sm text-edu-dark-blue mt-1">
                  Engagement: {student.engagement}% | Future Capability: {student.futureCapability}%
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-red-900 mb-4">⚠️ Requires Attention</h3>
          <ul className="space-y-3">
            {analytics.engagementByStudent.filter(s => s.engagement < 65).map((student, idx) => (
              <li key={idx} className="pb-2 border-b border-red-200">
                <p className="font-semibold text-red-800">{student.name}</p>
                <p className="text-sm text-red-700 mt-1">
                  Engagement: {student.engagement}% | Suggested: One-on-one check-in
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6">
        <h3 className="font-bold text-blue-900 mb-3">📊 Session Insights</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Average class engagement: 75% - meeting the 75% threshold</li>
          <li>• Strong correlation between engagement and future capability</li>
          <li>• One student below 75% engagement threshold</li>
          <li>• Consider diversifying instructional methods for lower-engagement students</li>
        </ul>
      </div>
    </div>
  );
};
