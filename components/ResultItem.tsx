import React from 'react';

interface ResultItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

export const ResultItem: React.FC<ResultItemProps> = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`${color} bg-white p-2 rounded-lg border border-slate-100 shadow-sm`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-600 print:text-slate-700">{label}</span>
    </div>
    <span className="font-bold text-slate-900 text-lg tracking-tight print:text-slate-900">{Math.round(value).toLocaleString()} ₸</span>
  </div>
);
