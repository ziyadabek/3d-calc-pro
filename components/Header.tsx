import * as React from 'react';
import { Calculator, Settings } from 'lucide-react';

interface HeaderProps {
    onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
    return (
        <header className="w-full max-w-4xl flex justify-between items-center mb-8 print:hidden">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-200">
                    <Calculator size={32} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">3D Calc Pro</h1>
                    <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-wider">Калькулятор Печати</p>
                </div>
            </div>
            <button
                onClick={onSettingsClick}
                className="p-3 bg-white shadow-sm border border-slate-200 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-700"
            >
                <Settings size={24} />
            </button>
        </header>
    );
};
