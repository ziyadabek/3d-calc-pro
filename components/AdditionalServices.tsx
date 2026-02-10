import * as React from 'react';
import { Wallet } from 'lucide-react';

interface AdditionalServicesProps {
    labor: number;
    onLaborChange: (value: number) => void;
}

export const AdditionalServices: React.FC<AdditionalServicesProps> = ({ labor, onLaborChange }) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 print:shadow-none print:border-none">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Wallet size={20} className="text-amber-500" />
                Дополнительные услуги
            </h2>
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase ml-1">Постобработка / Сборка (₸)</label>
                <input
                    type="number"
                    value={labor || ''}
                    onChange={(e) => onLaborChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-4 bg-amber-50 border-2 border-amber-100 rounded-2xl focus:border-amber-500 outline-none font-bold text-lg shadow-inner print:bg-white print:border-slate-300 text-amber-900"
                />
            </div>
        </div>
    );
};
