import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockStudents } from '../../utils/mockData';
import { Star, Lightbulb, Compass } from 'lucide-react';

export const FutureCapability = () => {
  const student = mockStudents[0]; // Alex Thompson

  // Create career prediction data based on interest levels
  const careerData = [
    {
      career: 'Engineer',
      match: 92,
      reasoning: 'Strong math & science interests',
    },
    {
      career: 'Mathematician',
      match: 90,
      reasoning: 'Exceptional math performance',
    },
    {
      career: 'Data Scientist',
      match: 88,
      reasoning: 'Math + analytical skills',
    },
    {
      career: 'Physics Teacher',
      match: 75,
      reasoning: 'Good science understanding',
    },
    {
      career: 'Software Developer',
      match: 80,
      reasoning: 'Problem-solving capability',
    },
  ];

  const topCareer = careerData[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Future Capability Predictor</h1>
        <p className="text-edu-slate mt-1">AI-powered career path recommendations based on your strengths</p>
      </div>

      {/* Top Recommendation */}
      <div className="bg-gradient-to-r from-edu-green to-green-600 rounded-lg shadow-md p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Compass size={32} />
          </div>
          <div>
            <p className="text-white/80 text-sm font-semibold">Top Career Match</p>
            <h2 className="text-4xl font-bold mt-1">{topCareer.career}</h2>
            <p className="text-white/90 mt-2 text-lg font-semibold">{topCareer.match}% Compatibility</p>
            <p className="text-white/70 mt-1">{topCareer.reasoning}</p>
          </div>
        </div>
      </div>

      {/* Career Compatibility Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Career Path Compatibility</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={careerData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#475569" domain={[0, 100]} />
            <YAxis dataKey="career" type="category" width={150} stroke="#475569" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              labelStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value}%`}
            />
            <Bar dataKey="match" fill="#059669" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Career Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Careers */}
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-4 flex items-center gap-2">
            <Star size={20} className="text-edu-green" />
            Recommended Career Paths
          </h3>
          <ul className="space-y-4">
            {careerData.slice(0, 3).map((item, idx) => (
              <li key={idx} className="pb-3 border-b border-green-200 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-edu-dark-blue">{item.career}</p>
                  <span className="px-2 py-1 bg-edu-green text-white rounded text-xs font-bold">{item.match}%</span>
                </div>
                <p className="text-sm text-edu-slate">{item.reasoning}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Development Suggestions */}
        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-blue-600" />
            Skill Development Path
          </h3>
          <ul className="space-y-3 text-sm text-blue-900">
            <li>
              <span className="font-semibold">Advanced Mathematics:</span>
              <p className="text-blue-800 mt-1">Take honors/AP Math courses to strengthen engineering foundation</p>
            </li>
            <li>
              <span className="font-semibold">STEM Projects:</span>
              <p className="text-blue-800 mt-1">Participate in robotics, coding, and science competitions</p>
            </li>
            <li>
              <span className="font-semibold">Coding Skills:</span>
              <p className="text-blue-800 mt-1">Learn programming languages (Python, Java, C++) early</p>
            </li>
            <li>
              <span className="font-semibold">Research Experience:</span>
              <p className="text-blue-800 mt-1">Seek internship or research opportunities in STEM fields</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Alternative Careers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-edu-dark-blue mb-4">Additional Career Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerData.slice(3).map((item, idx) => (
            <div key={idx} className="p-4 border-2 border-edu-light-slate rounded-lg hover:border-edu-green transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-edu-dark-blue">{item.career}</h4>
                <span className="text-lg font-bold text-edu-blue">{item.match}%</span>
              </div>
              <p className="text-sm text-edu-slate">{item.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <h3 className="font-bold text-yellow-900 mb-3">📋 Your Action Plan</h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>✓ <span className="font-semibold">Immediate:</span> Maintain excellence in Math and Science</li>
          <li>✓ <span className="font-semibold">This Semester:</span> Explore coding through electives</li>
          <li>✓ <span className="font-semibold">Next Year:</span> Participate in STEM clubs or competitions</li>
          <li>✓ <span className="font-semibold">Long-term:</span> Consider summer STEM camps or internships</li>
        </ul>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <p className="text-purple-900 font-semibold mb-2">🌟 You're on track!</p>
        <p className="text-purple-800 text-sm">
          Your strong performance in Mathematics and Science opens doors to many exciting career paths. Keep nurturing your interests, and you'll be well-prepared for advanced education and rewarding careers in STEM fields.
        </p>
      </div>
    </div>
  );
};
