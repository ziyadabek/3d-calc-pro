import * as React from 'react';
import { Layers, Trash2 } from 'lucide-react';
import { PrintPart, MaterialType, ComplexityLevel, CalcSettings } from '../types/index';
import { DEFAULT_MATERIALS, COMPLEXITY_MULTIPLIERS } from '../constants/index';

const MATERIAL_COLOR_DOT: Record<string, string> = {
    PLA: 'bg-blue-500',
    PETG: 'bg-emerald-500',
    ABS: 'bg-amber-500',
    ASA: 'bg-orange-500',
    PA_CF: 'bg-red-500',
    TPU: 'bg-purple-500',
    CUSTOM: 'bg-slate-500'
};

interface PartCardProps {
    part: PrintPart;
    canDelete: boolean;
    settings: CalcSettings;
    onUpdate: <K extends keyof PrintPart>(field: K, value: PrintPart[K]) => void;
    onDelete: () => void;
}

export const PartCard: React.FC<PartCardProps> = ({
    part,
    canDelete,
    settings,
    onUpdate,
    onDelete
}) => {
    return (
        <div className="glass-panel p-6 md:p-8 rounded-2xl relative group print:shadow-none print:border-none print:bg-white print:text-black">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-500 print:hidden">
                        <Layers size={22} />
                    </div>
                    <input
                        type="text"
                        value={part.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        className="bg-transparent text-slate-800 border-b border-transparent focus:border-brand outline-none hover:border-slate-300 transition-colors w-40 md:w-48 placeholder-slate-400 print:text-black font-semibold"
                        placeholder="Название"
                    />
                </h2>
                {canDelete && (
                    <button
                        onClick={onDelete}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Удалить деталь"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative group/input">
                        <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white z-10 print:bg-white print:text-slate-600">Вес (г)</label>
                        <input
                            type="number"
                            value={part.weight || ''}
                            onChange={(e) => onUpdate('weight', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="glass-input w-full px-4 py-4 rounded-xl font-bold text-lg text-slate-900 print:bg-white print:border-slate-300 print:text-black"
                        />
                    </div>
                    <div className="relative group/input">
                        <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white z-10 print:bg-white print:text-slate-600">Время (ч)</label>
                        <input
                            type="number"
                            value={part.hours || ''}
                            onChange={(e) => onUpdate('hours', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="glass-input w-full px-4 py-4 rounded-xl font-bold text-lg text-slate-900 print:bg-white print:border-slate-300 print:text-black"
                        />
                    </div>
                </div>

                <div className="relative group/input">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white z-10 print:bg-white print:text-slate-600">Материал</label>
                    <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${MATERIAL_COLOR_DOT[part.materialType] || 'bg-slate-400'}`} />
                        <select
                            value={part.materialType}
                            onChange={(e) => onUpdate('materialType', e.target.value as MaterialType)}
                            className="glass-input w-full pl-10 pr-4 py-4 rounded-xl font-bold text-lg appearance-none cursor-pointer text-slate-800 print:bg-white print:border-slate-300 print:text-black"
                        >
                            {Object.entries(DEFAULT_MATERIALS).map(([key, config]) => (
                                <option key={key} value={key} className="bg-white text-slate-800">{config.name} — {(settings.materialPrices[key as MaterialType] || 0).toLocaleString()} ₸/кг</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="relative group/input">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white z-10 print:bg-white print:text-slate-600">Сложность</label>
                    <select
                        value={part.complexity}
                        onChange={(e) => onUpdate('complexity', e.target.value as ComplexityLevel)}
                        className="glass-input w-full px-4 py-4 rounded-xl font-bold text-slate-700 print:bg-white print:border-slate-300 print:text-black"
                    >
                        {Object.entries(COMPLEXITY_MULTIPLIERS).map(([key, config]) => (
                            <option key={key} value={key} className="bg-white text-slate-800">{config.name} (x{config.factor})</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
