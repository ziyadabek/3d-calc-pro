import * as React from 'react';
import { Wrench, Percent, User } from 'lucide-react';

interface AdditionalServicesProps {
    labor: number;
    discountPercent: number;
    clientName: string;
    onLaborChange: (value: number) => void;
    onDiscountChange: (value: number) => void;
    onClientNameChange: (value: string) => void;
}

const LABOR_PRESETS = [0, 500, 1000, 2000, 5000];
const DISCOUNT_PRESETS = [0, 5, 10, 15, 20];

export const AdditionalServices: React.FC<AdditionalServicesProps> = ({
    labor,
    discountPercent,
    clientName,
    onLaborChange,
    onDiscountChange,
    onClientNameChange
}) => {
    return (
        <div className="glass-panel p-5 md:p-6 rounded-2xl relative group print:shadow-none print:border print:border-slate-300 print:bg-white print:text-black">
            <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60 print:hidden">
                        <Wrench size={20} />
                    </div>
                    <div>
                        <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            Постобработка, Скидка и Заказчик
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Сборка, склейка, шлифовка и персональные параметры КП
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Post-processing / Assembly Labor */}
                <div>
                    <label className="field-label flex items-center gap-1.5">
                        <Wrench size={12} className="text-slate-400" />
                        Постобработка / Сборка (₸)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            step="100"
                            value={labor || ''}
                            onChange={(e) => onLaborChange(Math.max(0, parseFloat(e.target.value) || 0))}
                            placeholder="0"
                            className="glass-input w-full pl-4 pr-10 py-2.5 rounded-xl font-mono font-bold text-base tabular-nums"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            ₸
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2 print:hidden">
                        {LABOR_PRESETS.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => onLaborChange(preset)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all ${
                                    labor === preset && preset > 0
                                        ? 'bg-amber-500 text-white border-amber-500'
                                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {preset === 0 ? 'Сброс' : `${preset.toLocaleString('ru-RU')} ₸`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Discount % */}
                <div>
                    <label className="field-label flex items-center gap-1.5">
                        <Percent size={12} className="text-slate-400" />
                        Скидка клиенту (%)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={discountPercent || ''}
                            onChange={(e) => onDiscountChange(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                            placeholder="0"
                            className="glass-input w-full pl-4 pr-10 py-2.5 rounded-xl font-mono font-bold text-base tabular-nums"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            %
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2 print:hidden">
                        {DISCOUNT_PRESETS.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => onDiscountChange(preset)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all ${
                                    discountPercent === preset && preset > 0
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {preset === 0 ? 'Без скидки' : `-${preset}%`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Client / Order Name for PDF & Report */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <label className="field-label flex items-center gap-1.5">
                    <User size={12} className="text-slate-400" />
                    Имя клиента или название заказа (для PDF и отчёта)
                </label>
                <input
                    type="text"
                    value={clientName}
                    onChange={(e) => onClientNameChange(e.target.value)}
                    placeholder="Например: ТОО «КазПром» — Шестерни редуктора"
                    className="glass-input w-full px-4 py-2.5 rounded-xl font-medium text-sm"
                />
            </div>
        </div>
    );
};
