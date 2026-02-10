import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { CalcResults } from '../types/index';

interface PriceTotalProps {
    results: CalcResults;
}

export const PriceTotal: React.FC<PriceTotalProps> = ({ results }) => {
    return (
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden print:bg-white print:text-black print:shadow-none print:border-2 print:border-slate-900">
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-bold uppercase tracking-widest text-blue-400 print:text-slate-600">Итоговая цена</h3>
                    <TrendingUp size={24} className="text-emerald-400 opacity-80 print:hidden" />
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-black text-white tabular-nums tracking-tighter print:text-black">
                        {Math.round(results.total).toLocaleString()}
                    </span>
                    <span className="text-2xl font-bold text-blue-400 opacity-80 print:text-slate-900">₸</span>
                </div>

                <div className="flex flex-wrap gap-2 print:hidden">
                    <div className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 flex items-center gap-2 backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase opacity-60">Маржа:</span>
                        <span className="text-emerald-400 font-bold text-sm">+{Math.round(results.markup).toLocaleString()} ₸</span>
                    </div>
                    {results.complexityBonus > 0 && (
                        <div className="px-3 py-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/20 flex items-center gap-2 backdrop-blur-md">
                            <span className="text-[10px] font-black uppercase opacity-60">Сложность:</span>
                            <span className="text-indigo-300 font-bold text-sm">+{Math.round(results.complexityBonus).toLocaleString()} ₸</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-[60px] print:hidden"></div>
        </div>
    );
};
