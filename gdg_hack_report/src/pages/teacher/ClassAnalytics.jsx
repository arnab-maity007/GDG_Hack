import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockClassAnalytics } from '../../utils/mockData';

export const ClassAnalytics = () => {
  const analytics = mockClassAnalytics;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Class Analytics</h1>
        <p className="text-edu-slate mt-1">Detailed breakdown of lecture focus and student response</p>
      </div>

      {/* Session Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-edu-blue">
          <p className="text-edu-slate text-sm">Lecture Topic</p>
          <p className="text-lg font-bold text-edu-dark-blue mt-1">{analytics.currentLecture.topic}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-edu-green">
          <p className="text-edu-slate text-sm">Total Duration</p>
          <p className="text-lg font-bold text-edu-dark-blue mt-1">{analytics.currentLecture.duration} minutes</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p className="text-edu-slate text-sm">On-Topic Time</p>
          <p className="text-lg font-bold text-edu-dark-blue mt-1">
            {analytics.currentLecture.onTopic} min ({Math.round((analytics.currentLecture.onTopic / analytics.currentLecture.duration) * 100)}%)
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <p className="text-edu-slate text-sm">Off-Topic Time</p>
          <p className="text-lg font-bold text-edu-dark-blue mt-1">
            {analytics.currentLecture.offTopic} min ({Math.round((analytics.currentLecture.offTopic / analytics.currentLecture.duration) * 100)}%)
          </p>
        </div>
      </div>

      {/* Detailed Focus Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Focus Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.currentLecture.topicBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="topic" stroke="#475569" />
            <YAxis stroke="#475569" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value} minutes`}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {analytics.currentLecture.topicBreakdown.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="value" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Analysis Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-4">✅ Meeting Standards</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-edu-dark-blue font-semibold">On-Topic Percentage</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 bg-edu-light-slate rounded-full h-2">
                  <div className="bg-edu-green h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <span className="text-sm font-bold text-edu-dark-blue">82%</span>
              </div>
              <p className="text-xs text-edu-slate mt-1">✓ Exceeds 75% threshold</p>
            </div>
            <div>
              <p className="text-sm text-edu-dark-blue font-semibold">Curriculum Coverage</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 bg-edu-light-slate rounded-full h-2">
                  <div className="bg-edu-green h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-sm font-bold text-edu-dark-blue">95%</span>
              </div>
              <p className="text-xs text-edu-slate mt-1">✓ All objectives covered</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-4">📊 Key Insights</h3>
          <ul className="space-y-2 text-sm text-edu-dark-blue">
            <li>• Strong focus maintenance throughout session</li>
            <li>• Off-topic time used for questions (productive)</li>
            <li>• All core topics were adequately covered</li>
            <li>• Student attention remained high</li>
            <li>• No curriculum gaps identified</li>
          </ul>
        </div>
      </div>

      {/* Time Breakdown Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-edu-dark-blue text-white">
          <h3 className="font-bold">Time Allocation Summary</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-edu-light-slate bg-edu-light-slate/50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Category</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Minutes</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Percentage</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-edu-light-slate hover:bg-edu-light-slate/20">
              <td className="px-6 py-4 text-sm font-semibold text-edu-dark-blue">Core Instruction</td>
              <td className="px-6 py-4 text-center text-sm text-edu-slate">37</td>
              <td className="px-6 py-4 text-center text-sm text-edu-slate">82%</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 bg-edu-green text-white rounded text-xs font-semibold">Excellent</span>
              </td>
            </tr>
            <tr className="border-b border-edu-light-slate hover:bg-edu-light-slate/20">
              <td className="px-6 py-4 text-sm font-semibold text-edu-dark-blue">Q&A / Discussion</td>
              <td className="px-6 py-4 text-center text-sm text-edu-slate">8</td>
              <td className="px-6 py-4 text-center text-sm text-edu-slate">18%</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">Beneficial</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
