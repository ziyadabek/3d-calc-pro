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
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold text-[15px] transition-all duration-300 shadow-sm active:scale-95 ${copied
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
            >
                {copied ? <CheckCircle2 size={20} /> : <Share2 size={20} />}
                {copied ? 'Скопировано!' : 'Копировать'}
            </button>
            <button
                onClick={onGeneratePDF}
                disabled={pdfLoading}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold text-[15px] transition-all duration-300 shadow-sm active:scale-95 border ${pdfLoading
                    ? 'bg-blue-50 text-blue-400 cursor-wait border-blue-100'
                    : 'bg-brand hover:bg-brand-dark border-brand hover:border-brand-dark text-white shadow-md'
                    }`}
            >
                <FileDown size={20} className={pdfLoading ? 'animate-spin' : ''} />
                {pdfLoading ? 'Создание...' : 'КП (PDF)'}
            </button>
        </div>
    );
};
