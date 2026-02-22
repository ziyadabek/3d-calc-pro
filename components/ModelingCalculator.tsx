import * as React from 'react';
import { PenTool, Clock, Layers, Star } from 'lucide-react';
import { ModelingComplexityLevel, CalcSettings } from '../types/index';
import { MODELING_COMPLEXITY_MULTIPLIERS } from '../constants/index';

interface ModelingCalculatorProps {
    hours: number;
    iterations: number;
    complexity: ModelingComplexityLevel;
    settings: CalcSettings;
    onHoursChange: (value: number) => void;
    onIterationsChange: (value: number) => void;
    onComplexityChange: (value: ModelingComplexityLevel) => void;
}

export const ModelingCalculator: React.FC<ModelingCalculatorProps> = ({
    hours,
    iterations,
    complexity,
    settings,
    onHoursChange,
    onIterationsChange,
    onComplexityChange
}) => {
    const currentRate = settings.modelingPrices?.[complexity] || 0;
    const iterRate = settings.modelingPerIteration || 0;
    const totalCost = (hours * currentRate) + (iterations * iterRate);

    return (
        <div className="glass-panel rounded-3xl p-6 md:p-8 relative group transition-all duration-300 print:shadow-none print:border-none print:bg-white print:text-black mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 print:hidden">
                        <PenTool size={22} />
                    </div>
                    <span className="text-white print:text-black">Моделирование</span>
                </h2>
                {totalCost > 0 && (
                    <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold max-w-max md:ml-auto print:hidden">
                        Итого: {Math.round(totalCost).toLocaleString()} ₸
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group/input">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 z-10 print:bg-white print:text-slate-600">
                        Время в Fusion 360 (ч)
                    </label>
                    <div className="relative flex items-center">
                        <Clock className="absolute left-4 text-slate-500" size={18} />
                        <input
                            type="number"
                            value={hours === 0 ? '' : hours}
                            onChange={(e) => onHoursChange(e.target.value === '' ? 0 : Number(e.target.value))}
                            min="0"
                            step="0.5"
                            placeholder="0"
                            className="glass-input w-full pl-12 pr-28 py-4 rounded-2xl font-bold text-lg text-indigo-300 placeholder-slate-600 print:bg-white print:border-slate-300 print:text-black"
                        />
                        <div className="absolute right-4 text-xs font-bold text-slate-500">
                            × {currentRate} ₸/ч
                        </div>
                    </div>
                </div>

                <div className="relative group/input">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 z-10 print:bg-white print:text-slate-600">
                        Итерации / Примерки
                    </label>
                    <div className="relative flex items-center">
                        <Layers className="absolute left-4 text-slate-500" size={18} />
                        <input
                            type="number"
                            value={iterations === 0 ? '' : iterations}
                            onChange={(e) => onIterationsChange(e.target.value === '' ? 0 : Number(e.target.value))}
                            min="0"
                            step="1"
                            placeholder="0"
                            className="glass-input w-full pl-12 pr-24 py-4 rounded-2xl font-bold text-lg text-indigo-300 placeholder-slate-600 print:bg-white print:border-slate-300 print:text-black"
                        />
                        <div className="absolute right-4 text-xs font-bold text-slate-500">
                            × {iterRate} ₸
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block print:text-slate-600">
                    Уровень сложности работы
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(MODELING_COMPLEXITY_MULTIPLIERS).map(([key, config]) => {
                        const level = key as ModelingComplexityLevel;
                        const isSelected = complexity === level;
                        return (
                            <button
                                key={level}
                                onClick={() => onComplexityChange(level)}
                                className={`relative p-4 rounded-2xl border text-left transition-all ${isSelected
                                    ? 'bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                    : 'glass-panel border-transparent hover:border-indigo-500/30 text-slate-400'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Star size={14} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                                    <span className={`font-bold text-sm ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                                        {config.name.split(' (')[0]}
                                    </span>
                                </div>
                                <div className={`text-xs mt-1 ${isSelected ? 'text-indigo-200/70' : 'text-slate-500'}`}>
                                    {config.description}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
