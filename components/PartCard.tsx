import * as React from 'react';
import { Trash2, Copy, Minus, Plus, Scale, Clock, Hash, Sparkles } from 'lucide-react';
import { PrintPart, MaterialType, ComplexityLevel, CalcSettings, PartCalculationBreakdown } from '../types/index';
import { DEFAULT_MATERIALS, COMPLEXITY_MULTIPLIERS } from '../constants/index';
import { splitHoursAndMinutes } from '../utils/formatters';

const MATERIAL_STYLES: Record<MaterialType, { dot: string; activePill: string }> = {
    [MaterialType.PLA]: {
        dot: 'bg-blue-500',
        activePill: 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
    },
    [MaterialType.PETG]: {
        dot: 'bg-emerald-500',
        activePill: 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
    },
    [MaterialType.ABS]: {
        dot: 'bg-amber-500',
        activePill: 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20'
    },
    [MaterialType.ASA]: {
        dot: 'bg-orange-500',
        activePill: 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
    },
    [MaterialType.PA_CF]: {
        dot: 'bg-red-500',
        activePill: 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-500/20'
    },
    [MaterialType.TPU]: {
        dot: 'bg-purple-500',
        activePill: 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
    },
    [MaterialType.CUSTOM]: {
        dot: 'bg-slate-500',
        activePill: 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-700 dark:border-slate-200'
    }
};

interface PartCardProps {
    index: number;
    part: PrintPart;
    breakdown?: PartCalculationBreakdown;
    canDelete: boolean;
    isClientMode: boolean;
    settings: CalcSettings;
    onUpdate: <K extends keyof PrintPart>(field: K, value: PrintPart[K]) => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

export const PartCard: React.FC<PartCardProps> = ({
    index,
    part,
    breakdown,
    canDelete,
    isClientMode,
    settings,
    onUpdate,
    onDuplicate,
    onDelete
}) => {
    const { hours: hPart, minutes: mPart } = splitHoursAndMinutes(part.hours);

    const handleHoursChange = (newH: number) => {
        const cleanH = Math.max(0, Math.floor(Number.isFinite(newH) ? newH : 0));
        onUpdate('hours', cleanH + mPart / 60);
    };

    const handleMinutesChange = (newM: number) => {
        const cleanM = Math.max(0, Math.floor(Number.isFinite(newM) ? newM : 0));
        onUpdate('hours', hPart + cleanM / 60);
    };

    const handleQtyChange = (delta: number) => {
        const next = Math.max(1, (part.quantity || 1) + delta);
        onUpdate('quantity', next);
    };

    const totalPrice = breakdown?.totalPrice ?? 0;
    const unitPrice = breakdown?.unitPrice ?? 0;
    const qty = part.quantity || 1;

    return (
        <div className="glass-panel rounded-2xl p-5 md:p-6 relative group hover:border-slate-300 dark:hover:border-slate-700 print:shadow-none print:border print:border-slate-300 print:bg-white print:text-black">
            {/* Top Header: Index, Editable Name, Live Cost Badge & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5 flex-1 min-w-[180px]">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        #{index + 1}
                    </span>
                    <input
                        type="text"
                        value={part.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        className="bg-transparent text-slate-900 dark:text-white font-bold text-base md:text-lg border-b border-transparent focus:border-brand dark:focus:border-blue-400 outline-none hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full truncate placeholder-slate-400"
                        placeholder="Название детали..."
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {/* Live Part Price Pill */}
                    <div className="text-right mr-1">
                        <div className="inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/70">
                            <span className="font-mono font-black text-base text-brand dark:text-blue-400 tabular-nums">
                                {Math.round(totalPrice).toLocaleString('ru-RU')}
                            </span>
                            <span className="text-xs font-bold text-blue-500 dark:text-blue-400">₸</span>
                        </div>
                        {qty > 1 && totalPrice > 0 && (
                            <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                {Math.round(unitPrice).toLocaleString('ru-RU')} ₸ × {qty} шт.
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onDuplicate}
                        className="p-2 text-slate-400 hover:text-brand dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all print:hidden"
                        title="Дублировать деталь"
                    >
                        <Copy size={17} />
                    </button>

                    {canDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all print:hidden"
                            title="Удалить деталь"
                        >
                            <Trash2 size={17} />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-5">
                {/* Row 1: Weight (g) + Print Time (h & min) + Quantity (pcs) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                    {/* Weight */}
                    <div className="sm:col-span-4">
                        <label className="field-label flex items-center gap-1">
                            <Scale size={12} className="text-slate-400" />
                            Вес 1 шт.
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={part.weight || ''}
                                onChange={(e) => onUpdate('weight', Math.max(0, parseFloat(e.target.value) || 0))}
                                placeholder="0"
                                className="glass-input w-full pl-3.5 pr-9 py-2.5 rounded-xl font-mono font-bold text-base tabular-nums"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                                г
                            </span>
                        </div>
                    </div>

                    {/* Time: Hours + Minutes */}
                    <div className="sm:col-span-5">
                        <label className="field-label flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            Время печати
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={hPart || ''}
                                    onChange={(e) => handleHoursChange(parseInt(e.target.value, 10) || 0)}
                                    placeholder="0"
                                    className="glass-input w-full pl-3 pr-7 py-2.5 rounded-xl font-mono font-bold text-base tabular-nums"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                                    ч
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    step="1"
                                    value={mPart || ''}
                                    onChange={(e) => handleMinutesChange(parseInt(e.target.value, 10) || 0)}
                                    placeholder="0"
                                    className="glass-input w-full pl-3 pr-9 py-2.5 rounded-xl font-mono font-bold text-base tabular-nums"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">
                                    мин
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="sm:col-span-3">
                        <label className="field-label flex items-center gap-1">
                            <Hash size={12} className="text-slate-400" />
                            Тираж (шт.)
                        </label>
                        <div className="flex items-center glass-input rounded-xl p-1 h-[46px]">
                            <button
                                type="button"
                                onClick={() => handleQtyChange(-1)}
                                disabled={qty <= 1}
                                className="w-8 h-full flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={qty}
                                onChange={(e) => onUpdate('quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                                className="w-full bg-transparent text-center font-mono font-bold text-base text-slate-900 dark:text-white outline-none tabular-nums"
                            />
                            <button
                                type="button"
                                onClick={() => handleQtyChange(1)}
                                className="w-8 h-full flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Row 2: Material Quick-Chips */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="field-label mb-0">Материал (Пластик)</label>
                        {!isClientMode && (
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                                Закуп: {(part.materialPrice || 0).toLocaleString('ru-RU')} ₸/кг
                                {breakdown && breakdown.pricePerGram > 0 ? ` • Продажа: ~${breakdown.pricePerGram.toFixed(0)} ₸/г` : ''}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {Object.entries(DEFAULT_MATERIALS).map(([key, config]) => {
                            const matKey = key as MaterialType;
                            const isSelected = part.materialType === matKey;
                            const style = MATERIAL_STYLES[matKey] || MATERIAL_STYLES[MaterialType.CUSTOM];

                            return (
                                <button
                                    key={matKey}
                                    type="button"
                                    onClick={() => onUpdate('materialType', matKey)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                        isSelected
                                            ? style.activePill
                                            : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            isSelected ? 'bg-white dark:bg-current' : style.dot
                                        }`}
                                    />
                                    <span>{config.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Inline Custom Material Price Input when CUSTOM is selected */}
                    {part.materialType === MaterialType.CUSTOM && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                Цена вашего пластика (за 1 кг):
                            </span>
                            <div className="relative w-36">
                                <input
                                    type="number"
                                    min="0"
                                    step="500"
                                    value={part.materialPrice || ''}
                                    onChange={(e) => onUpdate('materialPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                                    placeholder="10000"
                                    className="glass-input w-full pl-3 pr-12 py-1.5 rounded-lg font-mono font-bold text-sm text-right"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                                    ₸/кг
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Row 3: Complexity Segmented Control */}
                <div>
                    <label className="field-label flex items-center gap-1">
                        <Sparkles size={12} className="text-slate-400" />
                        Сложность геометрии и поддержек
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(COMPLEXITY_MULTIPLIERS).map(([key, config]) => {
                            const compKey = key as ComplexityLevel;
                            const isSelected = part.complexity === compKey;
                            return (
                                <button
                                    key={compKey}
                                    type="button"
                                    onClick={() => onUpdate('complexity', compKey)}
                                    title={config.desc}
                                    className={`py-2 px-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-blue-50/90 dark:bg-blue-950/70 border-brand dark:border-blue-500 text-brand-dark dark:text-blue-200 shadow-sm'
                                            : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full gap-1">
                                        <span className="text-xs font-bold truncate">{config.shortName}</span>
                                        <span
                                            className={`font-mono text-[11px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                                isSelected
                                                    ? 'bg-brand text-white'
                                                    : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            ×{config.factor}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
