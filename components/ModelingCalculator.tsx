import * as React from 'react';
import { PenTool, Clock, Layers, Sparkles, Minus, Plus } from 'lucide-react';
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
    const currentRate = settings.modelingPrices?.[complexity] ?? 0;
    const iterRate = settings.modelingPerIteration ?? 0;
    const totalCost = (hours * currentRate) + (iterations * iterRate);

    return (
        <div className="glass-panel p-5 md:p-6 rounded-2xl relative group print:shadow-none print:border print:border-slate-300 print:bg-white print:text-black">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 print:hidden">
                        <PenTool size={20} />
                    </div>
                    <div>
                        <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            3D-Моделирование и CAD
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Fusion 360 / SolidWorks • реверс-инжиниринг и примерки
                        </p>
                    </div>
                </div>

                {totalCost > 0 && (
                    <div className="inline-flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/70 dark:border-indigo-800/70">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">CAD:</span>
                        <span className="font-mono font-black text-base text-indigo-700 dark:text-indigo-300 tabular-nums">
                            +{Math.round(totalCost).toLocaleString('ru-RU')} ₸
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CAD Hours */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="field-label mb-0 flex items-center gap-1.5">
                            <Clock size={12} className="text-slate-400" />
                            Время работы в CAD (ч)
                        </label>
                        <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            × {currentRate.toLocaleString('ru-RU')} ₸/ч
                        </span>
                    </div>
                    <div className="flex items-center glass-input rounded-xl p-1 h-[46px]">
                        <button
                            type="button"
                            onClick={() => onHoursChange(Math.max(0, Number((hours - 0.5).toFixed(1))))}
                            disabled={hours <= 0}
                            className="w-9 h-full flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                        >
                            <Minus size={15} />
                        </button>
                        <input
                            type="number"
                            value={hours === 0 ? '' : hours}
                            onChange={(e) => onHoursChange(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            min="0"
                            step="0.5"
                            placeholder="0"
                            className="w-full bg-transparent text-center font-mono font-bold text-base text-slate-900 dark:text-white outline-none tabular-nums"
                        />
                        <button
                            type="button"
                            onClick={() => onHoursChange(Number((hours + 0.5).toFixed(1)))}
                            className="w-9 h-full flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Plus size={15} />
                        </button>
                    </div>
                </div>

                {/* Test Print Iterations */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="field-label mb-0 flex items-center gap-1.5">
                            <Layers size={12} className="text-slate-400" />
                            Итерации / Примерки (шт.)
                        </label>
                        <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            × {iterRate.toLocaleString('ru-RU')} ₸/шт
                        </span>
                    </div>
                    <div className="flex items-center glass-input rounded-xl p-1 h-[46px]">
                        <button
                            type="button"
                            onClick={() => onIterationsChange(Math.max(0, iterations - 1))}
                            disabled={iterations <= 0}
                            className="w-9 h-full flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                        >
                            <Minus size={15} />
                        </button>
                        <input
                            type="number"
                            value={iterations === 0 ? '' : iterations}
                            onChange={(e) => onIterationsChange(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                            min="0"
                            step="1"
                            placeholder="0"
                            className="w-full bg-transparent text-center font-mono font-bold text-base text-slate-900 dark:text-white outline-none tabular-nums"
                        />
                        <button
                            type="button"
                            onClick={() => onIterationsChange(iterations + 1)}
                            className="w-9 h-full flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Plus size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* CAD Complexity Selector */}
            <div className="mt-5">
                <label className="field-label flex items-center gap-1.5">
                    <Sparkles size={12} className="text-slate-400" />
                    Тариф и сложность проектирования
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {Object.entries(MODELING_COMPLEXITY_MULTIPLIERS).map(([key, config]) => {
                        const level = key as ModelingComplexityLevel;
                        const isSelected = complexity === level;
                        const rate = settings.modelingPrices?.[level] ?? config.defaultPrice;
                        return (
                            <button
                                key={level}
                                type="button"
                                onClick={() => onComplexityChange(level)}
                                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                    isSelected
                                        ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-500 shadow-sm'
                                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className={`font-bold text-xs ${isSelected ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {config.name.split(' (')[0]}
                                    </span>
                                    <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-md ${
                                        isSelected
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {rate.toLocaleString('ru-RU')} ₸/ч
                                    </span>
                                </div>
                                <div className={`text-[11px] leading-snug mt-1 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>
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
