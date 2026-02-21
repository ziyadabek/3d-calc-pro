import * as React from 'react';
import { Layers, Trash2 } from 'lucide-react';
import { PrintPart, MaterialType, ComplexityLevel, CalcSettings } from '../types/index';
import { DEFAULT_MATERIALS, COMPLEXITY_MULTIPLIERS } from '../constants/index';

const MATERIAL_COLOR_DOT: Record<string, string> = {
    PLA: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]',
    PETG: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]',
    ABS: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]',
    ASA: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]',
    PA_CF: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]',
    TPU: 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]',
    CUSTOM: 'bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.8)]'
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
        <div className="glass-panel rounded-3xl p-6 md:p-8 relative group transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 print:shadow-none print:border-none print:bg-white print:text-black">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 print:hidden">
                        <Layers size={22} />
                    </div>
                    <input
                        type="text"
                        value={part.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        className="bg-transparent text-white border-b-2 border-transparent focus:border-indigo-500 outline-none hover:border-slate-700 transition-colors w-40 md:w-48 placeholder-slate-600 print:text-black"
                        placeholder="Название"
                    />
                </h2>
                {canDelete && (
                    <button
                        onClick={onDelete}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                        title="Удалить деталь"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative group/input">
                        <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 z-10 print:bg-white print:text-slate-600">Вес (г)</label>
                        <input
                            type="number"
                            value={part.weight || ''}
                            onChange={(e) => onUpdate('weight', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="glass-input w-full px-4 py-4 rounded-2xl font-bold text-lg text-white print:bg-white print:border-slate-300 print:text-black"
                        />
                    </div>
                    <div className="relative group/input">
                        <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 z-10 print:bg-white print:text-slate-600">Время (ч)</label>
                        <input
                            type="number"
                            value={part.hours || ''}
                            onChange={(e) => onUpdate('hours', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="glass-input w-full px-4 py-4 rounded-2xl font-bold text-lg text-white print:bg-white print:border-slate-300 print:text-black"
                        />
                    </div>
                </div>

                <div className="relative group/input">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 z-10 print:bg-white print:text-slate-600">Материал</label>
                    <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${MATERIAL_COLOR_DOT[part.materialType] || 'bg-slate-400'}`} />
                        <select
                            value={part.materialType}
                            onChange={(e) => onUpdate('materialType', e.target.value as MaterialType)}
                            className="glass-input w-full pl-10 pr-4 py-4 rounded-2xl font-bold text-lg appearance-none cursor-pointer text-white print:bg-white print:border-slate-300 print:text-black"
                        >
                            {Object.entries(DEFAULT_MATERIALS).map(([key, config]) => (
                                <option key={key} value={key} className="bg-slate-900 text-white">{config.name} — {(settings.materialPrices[key as MaterialType] || 0).toLocaleString()} ₸/кг</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="relative group/input">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 z-10 print:bg-white print:text-slate-600">Сложность</label>
                    <select
                        value={part.complexity}
                        onChange={(e) => onUpdate('complexity', e.target.value as ComplexityLevel)}
                        className="glass-input w-full px-4 py-4 rounded-2xl font-bold text-slate-300 print:bg-white print:border-slate-300 print:text-black"
                    >
                        {Object.entries(COMPLEXITY_MULTIPLIERS).map(([key, config]) => (
                            <option key={key} value={key} className="bg-slate-900 text-white">{config.name} (x{config.factor})</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

