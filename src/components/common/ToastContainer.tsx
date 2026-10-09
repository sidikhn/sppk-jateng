import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-deep border-white/[0.12] text-platinum';
        let Icon = Info;
        let iconColor = 'text-aurora';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'text-aurora';
          bg = 'bg-deep/95 border-aurora/30 text-platinum shadow-[0_4px_20px_rgba(0,130,124,0.3)]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
          bg = 'bg-deep/95 border-rose-800 text-platinum shadow-[0_4px_20px_rgba(225,29,72,0.3)]';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-phosphor';
          bg = 'bg-deep/95 border-phosphor/30 text-platinum shadow-[0_4px_20px_rgba(253,233,255,0.2)]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-buttons border backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${bg}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs">
              <h4 className="font-medium text-platinum leading-tight">{toast.title}</h4>
              {toast.message && <p className="mt-1 text-silver leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-silver hover:text-platinum p-0.5 rounded-buttons transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
