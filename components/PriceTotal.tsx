import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { CalcResults } from '../types/index';

interface PriceTotalProps {
    results: CalcResults;
}

export const PriceTotal: React.FC<PriceTotalProps> = ({ results }) => {
    return (
        <div className="glass-panel bg-white rounded-2xl p-6 md:p-8 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="flex justify-center items-center mb-4 gap-2">
                    <TrendingUp size={24} className="text-brand print:hidden" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 print:text-slate-600">Итоговая цена</h3>
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                    <span className="text-6xl md:text-7xl font-black text-slate-900 tabular-nums tracking-tighter print:text-black">
                        {Math.round(results.total).toLocaleString()}
                    </span>
                    <span className="text-3xl font-bold text-slate-400 print:text-slate-900">₸</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 md:gap-3 print:hidden w-full">
                    <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-sm transition-all hover:bg-slate-100">
                        <span className="font-bold uppercase opacity-60 text-slate-500">Маржа:</span>
                        <span className="text-emerald-600 font-bold">+{Math.round(results.markup).toLocaleString()} ₸</span>
                    </div>
                    {results.complexityBonus > 0 && (
                        <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-sm transition-all hover:bg-slate-100">
                            <span className="font-bold uppercase opacity-60 text-slate-500">Сложность:</span>
                            <span className="text-blue-600 font-bold">+{Math.round(results.complexityBonus).toLocaleString()} ₸</span>
                        </div>
                    )}
                    {results.minOrderSurcharge > 0 && (
                        <div className="px-3 py-2 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 text-sm transition-all hover:bg-red-100">
                            <span className="font-bold uppercase opacity-60 text-red-500">До мин:</span>
                            <span className="text-red-600 font-bold">+{Math.round(results.minOrderSurcharge).toLocaleString()} ₸</span>
                        </div>
                    )}
                </div>
            </div>
            {/* Subtle light background decorations */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-[80px] print:hidden opacity-50"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] print:hidden opacity-50"></div>
        </div>
    );
};
