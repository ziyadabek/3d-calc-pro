import * as React from 'react';
import { useState } from 'react';
import { Plus } from 'lucide-react';

// Hooks
import { useSettings } from './hooks/useSettings';
import { useParts } from './hooks/useParts';
import { useCalculator } from './hooks/useCalculator';

// Services
import { copyReportToClipboard } from './services/reportGenerator';
import { generatePDF } from './services/pdfGenerator';

// Components
import { Header } from './components/Header';
import { PartCard } from './components/PartCard';
import { AdditionalServices } from './components/AdditionalServices';
import { PriceTotal } from './components/PriceTotal';
import { ActionButtons } from './components/ActionButtons';
import { DetailsSidebar } from './components/DetailsSidebar';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const { parts, addPart, removePart, updatePart } = useParts(settings);
  const [labor, setLabor] = useState(0);
  const results = useCalculator(parts, labor, settings);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleCopyReport = async () => {
    const success = await copyReportToClipboard(parts, labor, results);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGeneratePDF = async () => {
    setPdfLoading(true);
    try {
      await generatePDF(parts, settings, results);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Ошибка при генерации PDF. Попробуйте еще раз.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-slate-50 print:bg-white print:p-0">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 space-y-6 print:col-span-12">
          {parts.map((part) => (
            <PartCard
              key={part.id}
              part={part}
              canDelete={parts.length > 1}
              settings={settings}
              onUpdate={(field, value) => updatePart(part.id, field, value)}
              onDelete={() => removePart(part.id)}
            />
          ))}

          <button
            onClick={addPart}
            className="w-full py-4 bg-white border-2 border-dashed border-slate-300 text-slate-500 rounded-3xl font-bold flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-all active:scale-[0.99] print:hidden"
          >
            <Plus size={24} />
            Добавить деталь
          </button>

          <AdditionalServices labor={labor} onLaborChange={setLabor} />

          <PriceTotal results={results} />

          <ActionButtons
            copied={copied}
            pdfLoading={pdfLoading}
            onCopyReport={handleCopyReport}
            onGeneratePDF={handleGeneratePDF}
          />
        </section>

        <section className="lg:col-span-5 space-y-6 print:col-span-12">
          <DetailsSidebar results={results} />
        </section>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      <footer className="mt-12 pb-8 text-slate-400 text-[10px] font-black text-center uppercase tracking-widest print:mt-4 print:text-black">
        <p>© 2026 3D CALC PRO — Усть-Каменогорск</p>
      </footer>
    </div>
  );
};

export default App;
