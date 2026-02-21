import * as React from 'react';
import { Calculator, Settings } from 'lucide-react';

interface HeaderProps {
    onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
    return (
        <header className="w-full max-w-7xl flex justify-between items-center print:hidden relative z-10 glass-panel rounded-3xl p-4 px-6 md:px-8 mt-2">
            <div className="flex items-center gap-4">
                <div className="bg-indigo-600/20 p-3 rounded-2xl text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <Calculator size={32} strokeWidth={2} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white leading-none tracking-tight">3D Calc Pro</h1>
                    <p className="text-indigo-300 text-xs font-bold mt-1.5 uppercase tracking-widest opacity-80">Premium Print Calculator</p>
                </div>
            </div>
            <button
                onClick={onSettingsClick}
                className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:bg-slate-700 hover:border-indigo-500/50 transition-all text-slate-300 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] shadow-inner"
            >
                <Settings size={24} />
            </button>
        </header>
    );
};

