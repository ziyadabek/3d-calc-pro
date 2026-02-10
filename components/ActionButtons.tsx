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
        <div className="grid grid-cols-2 gap-3 print:hidden">
            <button
                onClick={onCopyReport}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-base transition-all shadow-md active:scale-95 ${copied
                        ? 'bg-emerald-600 text-white shadow-emerald-200'
                        : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-slate-200'
                    }`}
            >
                {copied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
                {copied ? 'Скопировано!' : 'Копировать'}
            </button>
            <button
                onClick={onGeneratePDF}
                disabled={pdfLoading}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-base transition-all shadow-md active:scale-95 ${pdfLoading
                        ? 'bg-blue-400 text-white/80 cursor-wait shadow-blue-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                    }`}
            >
                <FileDown size={18} className={pdfLoading ? 'animate-spin' : ''} />
                {pdfLoading ? 'Загрузка...' : 'КП (PDF)'}
            </button>
        </div>
    );
};
