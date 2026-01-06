import { useState } from 'react';
import { mockAlerts } from '../../utils/mockData';
import { AlertBox } from '../../components/AlertBox';
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

export const AlertSystem = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('all'); // all, high, medium, low

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const handleDismiss = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertTitle = (type, target) => {
    if (type === 'teacher') {
      return 'Teacher Performance Alert';
    } else {
      return 'Student Engagement Alert';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-edu-dark-blue">Alert System</h1>
        <p className="text-edu-slate mt-1">Monitor below-threshold performance indicators</p>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <p className="text-red-800 text-sm font-medium">High Priority</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {alerts.filter(a => a.severity === 'high').length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-yellow-800 text-sm font-medium">Medium Priority</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {alerts.filter(a => a.severity === 'medium').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-blue-800 text-sm font-medium">Total Active Alerts</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{alerts.length}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {['all', 'high', 'medium', 'low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
              filter === f
                ? 'bg-edu-green text-white'
                : 'bg-edu-light-slate text-edu-dark-blue hover:bg-edu-slate/30'
            }`}
          >
            {f === 'all' ? 'All Alerts' : `${f} Priority`}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-edu-light-green rounded-lg shadow-md p-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-edu-green mb-4" />
            <p className="text-lg font-semibold text-edu-dark-blue">No Alerts</p>
            <p className="text-edu-slate mt-1">All metrics are within acceptable thresholds</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div key={alert.id} className="relative">
              <AlertBox
                severity={alert.severity}
                title={getAlertTitle(alert.type, alert.target)}
                message={alert.message}
              />
              <button
                onClick={() => handleDismiss(alert.id)}
                className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded transition-colors"
              >
                <Trash2 size={18} className="text-edu-slate" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Alert Guidelines */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="font-bold text-blue-900 mb-3">Alert Thresholds</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>🔴 <span className="font-semibold">High:</span> Below 60% on-topic (teachers) or engagement (students)</li>
          <li>🟡 <span className="font-semibold">Medium:</span> 60-75% on-topic/engagement</li>
          <li>🔵 <span className="font-semibold">Low:</span> 75-85% on-topic/engagement</li>
        </ul>
      </div>
    </div>
  );
};
