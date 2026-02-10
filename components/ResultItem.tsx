
import React from 'react';

interface ResultItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

export const ResultItem: React.FC<ResultItemProps> = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-300">
    <div className="flex items-center gap-3">
      <div className={`${color} bg-slate-50 p-2 rounded-lg`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
    <span className="font-bold text-slate-900 text-lg">{Math.round(value).toLocaleString()} ₸</span>
  </div>
);
