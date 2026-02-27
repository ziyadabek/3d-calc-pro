import * as React from 'react';
import { Wallet } from 'lucide-react';

interface AdditionalServicesProps {
    labor: number;
    onLaborChange: (value: number) => void;
}

export const AdditionalServices: React.FC<AdditionalServicesProps> = ({ labor, onLaborChange }) => {
    return (
        <div className="glass-panel p-6 md:p-8 relative group print:shadow-none print:border-none print:bg-white print:text-black rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-xl text-slate-500 print:hidden">
                    <Wallet size={22} />
                </div>
                <span className="text-slate-800 print:text-black">Дополнительные услуги</span>
            </h2>
            <div className="relative group/input">
                <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white z-10 print:bg-white print:text-slate-600">Постобработка / Сборка (₸)</label>
                <input
                    type="number"
                    value={labor || ''}
                    onChange={(e) => onLaborChange(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="glass-input w-full px-4 py-4 rounded-xl font-bold text-lg text-slate-900 placeholder-slate-400 print:bg-white print:border-slate-300 print:text-black"
                />
            </div>
        </div>
    );
};
