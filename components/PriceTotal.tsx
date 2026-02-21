import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { CalcResults } from '../types/index';

interface PriceTotalProps {
    results: CalcResults;
}

export const PriceTotal: React.FC<PriceTotalProps> = ({ results }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(99,102,241,0.2)] border border-indigo-500/20 text-white relative overflow-hidden print:bg-white print:text-black print:shadow-none print:border-2 print:border-slate-900 group transition-all duration-500 hover:shadow-[0_10px_50px_rgba(99,102,241,0.3)] hover:border-indigo-400/40">
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="flex justify-center items-center mb-4 gap-2">
                    <TrendingUp size={24} className="text-indigo-400 print:hidden" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300 print:text-slate-600">Итоговая цена</h3>
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                    <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tabular-nums tracking-tighter print:text-black">
                        {Math.round(results.total).toLocaleString()}
                    </span>
                    <span className="text-3xl font-bold text-indigo-400 opacity-80 print:text-slate-900">₸</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 md:gap-3 print:hidden w-full">
                    <div className="px-3 py-2 bg-slate-950/50 rounded-xl border border-white/5 flex items-center gap-2 backdrop-blur-md shadow-inner text-sm transition-all hover:bg-slate-950/80">
                        <span className="font-bold uppercase opacity-60">Маржа:</span>
                        <span className="text-emerald-400 font-bold">+{Math.round(results.markup).toLocaleString()} ₸</span>
                    </div>
                    {results.complexityBonus > 0 && (
                        <div className="px-3 py-2 bg-indigo-950/40 rounded-xl border border-indigo-500/20 flex items-center gap-2 backdrop-blur-md shadow-inner text-sm transition-all hover:bg-indigo-950/60">
                            <span className="font-bold uppercase opacity-60">Сложность:</span>
                            <span className="text-indigo-300 font-bold">+{Math.round(results.complexityBonus).toLocaleString()} ₸</span>
                        </div>
                    )}
                    {results.minOrderSurcharge > 0 && (
                        <div className="px-3 py-2 bg-red-950/40 rounded-xl border border-red-500/20 flex items-center gap-2 backdrop-blur-md shadow-inner text-sm transition-all hover:bg-red-950/60">
                            <span className="font-bold uppercase opacity-60">До мин:</span>
                            <span className="text-red-300 font-bold">+{Math.round(results.minOrderSurcharge).toLocaleString()} ₸</span>
                        </div>
                    )}
                </div>
            </div>
            {/* Animated Glow Elements */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px] print:hidden group-hover:bg-indigo-500/40 transition-all duration-700"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] print:hidden group-hover:bg-blue-500/30 transition-all duration-700"></div>
        </div>
    );
};

