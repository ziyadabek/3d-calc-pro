import * as React from 'react';
import { Wallet } from 'lucide-react';

interface AdditionalServicesProps {
    labor: number;
    onLaborChange: (value: number) => void;
}

export const AdditionalServices: React.FC<AdditionalServicesProps> = ({ labor, onLaborChange }) => {
    return (
        <div className="glass-panel rounded-3xl p-6 md:p-8 relative group transition-all duration-300 print:shadow-none print:border-none print:bg-white print:text-black mt-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 print:hidden">
                    <Wallet size={22} />
                </div>
                <span className="text-white print:text-black">Дополнительные услуги</span>
            </h2>
            <div className="relative group/input">
                <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 z-10 print:bg-white print:text-slate-600">Постобработка / Сборка (₸)</label>
                <input
                    type="number"
                    value={labor || ''}
                    onChange={(e) => onLaborChange(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="glass-input w-full px-4 py-4 rounded-2xl font-bold text-lg text-amber-300 placeholder-slate-600 print:bg-white print:border-slate-300 print:text-black"
                />
            </div>
        </div>
    );
};

