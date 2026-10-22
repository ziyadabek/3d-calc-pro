import React from 'react';

interface ResultItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  dotColor?: string;
  isNegative?: boolean;
}

export const ResultItem: React.FC<ResultItemProps> = ({
  icon,
  label,
  value,
  color,
  dotColor,
  isNegative = false
}) => (
  <div className="flex items-center justify-between p-2.5 px-3 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
    <div className="flex items-center gap-2.5">
      <div className={`${color} bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700 shadow-sm relative`}>
        {icon}
        {dotColor && (
          <span
            className="w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900"
            style={{ backgroundColor: dotColor }}
          />
        )}
      </div>
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 print:text-slate-700">
        {label}
      </span>
    </div>
    <span className={`font-mono font-bold text-sm tabular-nums ${
      isNegative
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-slate-900 dark:text-white print:text-slate-900'
    }`}>
      {isNegative ? '-' : ''}{Math.round(Math.abs(value)).toLocaleString('ru-RU')} ₸
    </span>
  </div>
);
