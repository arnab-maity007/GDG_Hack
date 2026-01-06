import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { mockStudents } from '../../utils/mockData';

export const InterestRadar = () => {
  const student = mockStudents[0]; // Alex Thompson

  // Transform interest levels to array for radar chart
  const radarData = Object.entries(student.interestLevels).map(([subject, interest]) => ({
    subject,
    interest,
    fullMark: 100,
  }));

  const highestInterest = Object.entries(student.interestLevels).sort((a, b) => b[1] - a[1])[0];
  const lowestInterest = Object.entries(student.interestLevels).sort((a, b) => a[1] - b[1])[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Interest Radar</h1>
        <p className="text-edu-slate mt-1">Your interest levels across different subjects</p>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Interest Profile</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" stroke="#475569" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#475569" />
            <Radar
              name="Interest Level (%)"
              dataKey="interest"
              stroke="#1e40af"
              fill="#1e40af"
              fillOpacity={0.6}
            />
            <Legend />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value}%`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High Interest Subjects */}
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-4">⭐ High Interest Subjects (70%+)</h3>
          <ul className="space-y-3">
            {radarData.filter(s => s.interest >= 70).map((item, idx) => (
              <li key={idx} className="pb-2 border-b border-green-200">
                <p className="font-semibold text-edu-dark-blue">{item.subject}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-white rounded-full h-2">
                    <div className="bg-edu-green h-2 rounded-full" style={{ width: `${item.interest}%` }}></div>
                  </div>
                  <span className="font-bold text-edu-dark-blue min-w-10">{item.interest}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Development Areas */}
        <div className="bg-yellow-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-yellow-900 mb-4">📈 Areas for Growth</h3>
          <ul className="space-y-3">
            {radarData.filter(s => s.interest < 70).map((item, idx) => (
              <li key={idx} className="pb-2 border-b border-yellow-200">
                <p className="font-semibold text-yellow-900">{item.subject}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-white rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${item.interest}%` }}></div>
                  </div>
                  <span className="font-bold text-yellow-900 min-w-10">{item.interest}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Subject Rankings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Subject Rankings</h2>
        <div className="space-y-2">
          {radarData.sort((a, b) => b.interest - a.interest).map((item, rank) => (
            <div key={item.subject} className="flex items-center gap-4 pb-3 border-b border-edu-light-slate last:border-0">
              <div className="flex-shrink-0 w-8 h-8 bg-edu-blue text-white rounded-full flex items-center justify-center font-bold">
                {rank + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-edu-dark-blue">{item.subject}</p>
              </div>
              <div className="w-40 bg-edu-light-slate rounded-full h-2">
                <div className="bg-edu-blue h-2 rounded-full" style={{ width: `${item.interest}%` }}></div>
              </div>
              <span className="font-bold text-edu-dark-blue min-w-12 text-right">{item.interest}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-blue-900 mb-3">🎯 Your Strengths</h3>
          <p className="text-sm text-blue-800 mb-2">
            You show strong interest in <span className="font-semibold">{highestInterest[0]}</span> ({highestInterest[1]}%). This is a great area for deeper exploration!
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Strong foundation in core subjects</li>
            <li>✓ Well-rounded learning profile</li>
            <li>✓ Consistent engagement</li>
          </ul>
        </div>

        <div className="bg-purple-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-purple-900 mb-3">💡 Recommendations</h3>
          <p className="text-sm text-purple-800 mb-2">
            Consider developing <span className="font-semibold">{lowestInterest[0]}</span> ({lowestInterest[1]}%) through:
          </p>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Real-world applications</li>
            <li>• Collaborative learning projects</li>
            <li>• Peer tutoring opportunities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
