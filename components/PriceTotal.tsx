import * as React from 'react';
import { Sparkles, Scale, Clock, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { CalcResults } from '../types/index';
import { formatDuration } from '../utils/formatters';

interface PriceTotalProps {
    results: CalcResults;
    isClientMode: boolean;
}

export const PriceTotal: React.FC<PriceTotalProps> = ({ results, isClientMode }) => {
    const avgPricePerGram = results.totalWeight > 0
        ? (results.total / results.totalWeight).toFixed(0)
        : null;

    return (
        <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white shadow-xl shadow-slate-900/15 border border-slate-800 relative overflow-hidden print:bg-white print:text-black print:border-slate-300 print:shadow-none">
            {/* Ambient glow */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none print:hidden" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none print:hidden" />

            <div className="relative z-10">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-400 print:hidden" />
                        <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">
                            Итого к оплате
                        </span>
                    </div>

                    {results.discountPercent > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Скидка -{results.discountPercent}%
                        </span>
                    )}
                </div>

                {/* Main Total Number */}
                <div className="flex items-baseline gap-2 my-2">
                    <span className="text-5xl md:text-6xl font-mono font-black tracking-tight tabular-nums text-white print:text-black">
                        {Math.round(results.total).toLocaleString('ru-RU')}
                    </span>
                    <span className="text-2xl md:text-3xl font-bold text-blue-400 print:text-slate-800">₸</span>
                    {avgPricePerGram && !isClientMode && (
                        <span className="ml-auto text-xs font-mono font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80 print:hidden">
                            ~{avgPricePerGram} ₸/г
                        </span>
                    )}
                </div>

                {/* Physical Order Metrics Grid (Weight, Time, Quantity) */}
                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800/90 print:border-slate-200">
                    <div className="bg-slate-800/60 print:bg-slate-100 rounded-xl p-2.5 border border-slate-700/50 print:border-slate-200">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 print:text-slate-500">
                            <Package size={12} className="text-blue-400" />
                            <span>Деталей</span>
                        </div>
                        <div className="font-mono font-bold text-sm md:text-base text-white print:text-black mt-0.5 tabular-nums">
                            {results.totalQuantity} шт.
                        </div>
                    </div>

                    <div className="bg-slate-800/60 print:bg-slate-100 rounded-xl p-2.5 border border-slate-700/50 print:border-slate-200">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 print:text-slate-500">
                            <Scale size={12} className="text-emerald-400" />
                            <span>Общий вес</span>
                        </div>
                        <div className="font-mono font-bold text-sm md:text-base text-white print:text-black mt-0.5 tabular-nums">
                            {Math.round(results.totalWeight).toLocaleString('ru-RU')} г
                        </div>
                    </div>

                    <div className="bg-slate-800/60 print:bg-slate-100 rounded-xl p-2.5 border border-slate-700/50 print:border-slate-200">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 print:text-slate-500">
                            <Clock size={12} className="text-amber-400" />
                            <span>Печать</span>
                        </div>
                        <div className="font-mono font-bold text-sm md:text-base text-white print:text-black mt-0.5 tabular-nums truncate">
                            {formatDuration(results.totalHours)}
                        </div>
                    </div>
                </div>

                {/* Master Profit vs Cost Bar (Hidden in Client Mode) */}
                {!isClientMode && results.total > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 print:hidden">
                        <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                                Чистая прибыль
                            </span>
                            <span className="font-mono font-extrabold text-sm text-emerald-400 tabular-nums">
                                +{Math.round(results.netProfit).toLocaleString('ru-RU')} ₸
                            </span>
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/70 flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Расходники и свет
                            </span>
                            <span className="font-mono font-extrabold text-sm text-slate-200 tabular-nums">
                                {Math.round(results.hardwareCost).toLocaleString('ru-RU')} ₸
                            </span>
                        </div>
                    </div>
                )}

                {/* Client Mode Active Indicator */}
                {isClientMode && (
                    <div className="mt-3 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center gap-2 text-xs font-medium text-blue-200 print:hidden">
                        <ShieldCheck size={15} className="text-blue-400 shrink-0" />
                        <span>Гарантия качества печати и соблюдения допусков</span>
                    </div>
                )}

                {/* Minimum Order Surcharge Notice */}
                {results.minOrderSurcharge > 0 && (
                    <div className="mt-3 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 print:hidden">
                        <span className="flex items-center gap-1.5 font-semibold">
                            <AlertCircle size={14} className="text-amber-400 shrink-0" />
                            Минимальный заказ:
                        </span>
                        <span className="font-mono font-bold text-amber-300">
                            +{Math.round(results.minOrderSurcharge).toLocaleString('ru-RU')} ₸
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
