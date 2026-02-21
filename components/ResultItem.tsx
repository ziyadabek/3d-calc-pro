import React from 'react';

interface ResultItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

export const ResultItem: React.FC<ResultItemProps> = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between p-3 glass-panel rounded-xl border border-slate-800 shadow-sm transition-all hover:bg-slate-800/80 hover:border-slate-700 print:bg-white print:border-slate-200">
    <div className="flex items-center gap-3">
      <div className={`${color} bg-slate-950 p-2 rounded-lg print:bg-slate-50`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-300 print:text-slate-700">{label}</span>
    </div>
    <span className="font-bold text-white text-lg tracking-tight print:text-slate-900">{Math.round(value).toLocaleString()} ₸</span>
  </div>
);
