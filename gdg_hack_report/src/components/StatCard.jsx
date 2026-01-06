export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-edu-blue',
    green: 'bg-green-50 text-edu-green',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-edu-green">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-edu-slate text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-edu-dark-blue mt-2">{value}</p>
          {subtitle && <p className="text-edu-slate text-xs mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};
