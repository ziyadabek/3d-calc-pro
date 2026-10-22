import * as React from 'react';
import { Copy, CheckCircle2, FileDown } from 'lucide-react';

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
        <div className="grid grid-cols-2 gap-3 print:hidden">
            <button
                type="button"
                onClick={onCopyReport}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm active:scale-[0.98] border ${
                    copied
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
            >
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Скопировано!' : 'Текст для чата'}</span>
            </button>
            <button
                type="button"
                onClick={onGeneratePDF}
                disabled={pdfLoading}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm active:scale-[0.98] border ${
                    pdfLoading
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-400 cursor-wait border-blue-200 dark:border-blue-800'
                        : 'bg-brand hover:bg-brand-hover border-brand text-white shadow-md shadow-blue-600/20'
                }`}
            >
                <FileDown size={18} className={pdfLoading ? 'animate-bounce' : ''} />
                <span>{pdfLoading ? 'Создаём PDF...' : 'Скачать КП (PDF)'}</span>
            </button>
        </div>
    );
};
