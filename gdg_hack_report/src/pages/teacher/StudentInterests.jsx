import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockClassAnalytics } from '../../utils/mockData';

export const StudentInterests = () => {
  const analytics = mockClassAnalytics;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Student Interest Heatmap</h1>
        <p className="text-edu-slate mt-1">Topics capturing the most student attention</p>
      </div>

      {/* Interest Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-edu-green">
          <p className="text-edu-slate text-sm">Most Interesting Topic</p>
          <p className="text-2xl font-bold text-edu-dark-blue mt-2">Quadratic Equations</p>
          <p className="text-edu-slate text-sm mt-1">85% student interest</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-edu-slate text-sm">Average Interest Level</p>
          <p className="text-2xl font-bold text-edu-dark-blue mt-2">76.6%</p>
          <p className="text-edu-slate text-sm mt-1">across all topics</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-edu-slate text-sm">Least Interesting Topic</p>
          <p className="text-2xl font-bold text-edu-dark-blue mt-2">Applications</p>
          <p className="text-edu-slate text-sm mt-1">68% student interest</p>
        </div>
      </div>

      {/* Interest Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Topic Interest Levels</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.studentInterest} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#475569" />
            <YAxis dataKey="topic" type="category" width={150} stroke="#475569" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value}% interest`}
            />
            <Bar dataKey="interest" fill="#059669" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-4">🌟 High Interest Topics (70%+)</h3>
          <ul className="space-y-3">
            {analytics.studentInterest.filter(t => t.interest >= 70).map((topic, idx) => (
              <li key={idx} className="flex items-center justify-between pb-2 border-b border-green-200">
                <span className="font-semibold text-edu-dark-blue">{topic.topic}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-white rounded-full h-2">
                    <div className="bg-edu-green h-2 rounded-full" style={{ width: `${(topic.interest / 100) * 100}%` }}></div>
                  </div>
                  <span className="font-bold text-edu-dark-blue min-w-12">{topic.interest}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-4">💡 Recommendations</h3>
          <ul className="space-y-2 text-sm text-edu-dark-blue">
            <li>✓ Expand content on high-interest topics</li>
            <li>✓ Use Applications as application-based learning</li>
            <li>✓ Create peer teaching with engaged students</li>
            <li>✓ Connect topics to real-world examples</li>
            <li>✓ Develop enrichment materials for enthusiastic learners</li>
            <li>✓ Build bridges between topics to increase engagement</li>
          </ul>
        </div>
      </div>

      {/* Interest Trend Insight */}
      <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <h3 className="font-bold text-yellow-900 mb-3">⚠️ Topics Needing Attention</h3>
        <p className="text-sm text-yellow-800 mb-3">
          "Applications" shows lower interest (68%). Consider:
        </p>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>• Demonstrating practical real-world applications</li>
          <li>• Using case studies and problem-solving activities</li>
          <li>• Incorporating hands-on learning experiences</li>
          <li>• Connecting to students' personal interests</li>
        </ul>
      </div>
    </div>
  );
};
