import { mockTeachers } from '../../utils/mockData';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

export const TeacherOversight = () => {
  const getStatusColor = (percentage) => {
    return percentage >= 75 ? 'text-edu-green bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusBadge = (percentage) => {
    return percentage >= 75 ? 'bg-edu-green text-white' : 'bg-red-100 text-red-800';
  };

  const sortedTeachers = [...mockTeachers].sort((a, b) => b.onTopicPercentage - a.onTopicPercentage);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Teacher Oversight</h1>
        <p className="text-edu-slate mt-1">Monitor teacher performance across the school</p>
      </div>

      {/* Teacher Rankings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-edu-dark-blue text-white">
          <h2 className="text-lg font-bold">Teacher Rankings by On-Topic Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-edu-light-slate">
                <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Rank</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Teacher Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-edu-dark-blue">Subject</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">On-Topic %</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Curriculum</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Avg Engagement</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-edu-dark-blue">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeachers.map((teacher, index) => (
                <tr key={teacher.id} className="border-b border-edu-light-slate hover:bg-edu-light-slate/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-edu-dark-blue">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-semibold text-edu-dark-blue">{teacher.name}</p>
                      <p className="text-xs text-edu-slate">Last session: {teacher.lastSession}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-edu-slate">{teacher.subject}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-edu-dark-blue">{teacher.onTopicPercentage}%</span>
                      {teacher.onTopicPercentage >= 75 ? (
                        <TrendingUp size={18} className="text-edu-green" />
                      ) : (
                        <TrendingDown size={18} className="text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${teacher.curriculumCovered >= 80 ? 'text-edu-green' : 'text-yellow-600'}`}>
                      {teacher.curriculumCovered}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-edu-dark-blue font-semibold">
                    {teacher.averageEngagement}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(teacher.onTopicPercentage)}`}>
                      {teacher.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-edu-light-green rounded-lg shadow-md p-6">
          <h3 className="font-bold text-edu-dark-blue mb-3 flex items-center gap-2">
            <CheckCircle size={20} className="text-edu-green" />
            Exemplary Teachers
          </h3>
          <ul className="space-y-2">
            {sortedTeachers.filter(t => t.onTopicPercentage >= 75).map(teacher => (
              <li key={teacher.id} className="text-sm text-edu-dark-blue">
                <span className="font-semibold">{teacher.name}</span> - {teacher.onTopicPercentage}% on-topic
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h3 className="font-bold text-red-900 mb-3">Needs Improvement</h3>
          <ul className="space-y-2">
            {sortedTeachers.filter(t => t.onTopicPercentage < 75).map(teacher => (
              <li key={teacher.id} className="text-sm text-red-800">
                <span className="font-semibold">{teacher.name}</span> - {teacher.onTopicPercentage}% on-topic
                <p className="text-xs text-red-700 mt-1">Below 75% threshold - coaching recommended</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
