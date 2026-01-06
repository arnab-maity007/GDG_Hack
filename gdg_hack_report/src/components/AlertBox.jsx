import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export const AlertBox = ({ severity = 'info', title, message, onClose }) => {
  const styles = {
    high: 'bg-red-50 border-red-200 text-red-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    low: 'bg-blue-50 border-blue-200 text-blue-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    high: <AlertCircle size={20} />,
    medium: <AlertCircle size={20} />,
    low: <Info size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${styles[severity]}`}>
      <div className="mt-0.5">{icons[severity]}</div>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70"
        >
          ✕
        </button>
      )}
    </div>
  );
};
