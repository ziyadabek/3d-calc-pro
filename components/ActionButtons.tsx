import * as React from 'react';
import { Share2, CheckCircle2, FileDown } from 'lucide-react';

interface ActionButtonsProps {
    copied: boolean;
    pdfLoading: boolean;
    onCopyReport: () => void;
    onGeneratePDF: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    copied,
    pdfLoading,
    onCopyReport,
    onGeneratePDF
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 print:hidden mt-6">
            <button
                onClick={onCopyReport}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-[15px] transition-all duration-300 shadow-lg active:scale-95 ${copied
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(52,211,153,0.2)]'
                    : 'glass-panel hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                    }`}
            >
                {copied ? <CheckCircle2 size={20} /> : <Share2 size={20} />}
                {copied ? 'Скопировано!' : 'Копировать'}
            </button>
            <button
                onClick={onGeneratePDF}
                disabled={pdfLoading}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-[15px] transition-all duration-300 shadow-lg active:scale-95 border ${pdfLoading
                    ? 'bg-indigo-600/50 text-white/50 cursor-wait border-indigo-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 hover:border-indigo-400 text-white shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.6)]'
                    }`}
            >
                <FileDown size={20} className={pdfLoading ? 'animate-spin' : ''} />
                {pdfLoading ? 'Создание...' : 'КП (PDF)'}
            </button>
        </div>
    );
};

