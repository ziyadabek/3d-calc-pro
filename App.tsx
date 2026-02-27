import * as React from 'react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ModelingComplexityLevel } from './types/index';

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
import { ModelingCalculator } from './components/ModelingCalculator';
import { PriceTotal } from './components/PriceTotal';
import { ActionButtons } from './components/ActionButtons';
import { DetailsSidebar } from './components/DetailsSidebar';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const { parts, addPart, removePart, updatePart } = useParts(settings);
  const [labor, setLabor] = useState(0);
  const [modelingHours, setModelingHours] = useState(0);
  const [modelingIterations, setModelingIterations] = useState(0);
  const [modelingComplexity, setModelingComplexity] = useState<ModelingComplexityLevel>(ModelingComplexityLevel.NORMAL);
  const results = useCalculator(parts, labor, settings, modelingHours, modelingIterations, modelingComplexity);

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
    <div className="min-h-screen p-4 md:p-6 lg:p-10 flex flex-col items-center bg-slate-50 print:bg-white print:p-0">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

        {/* Left Area - Parts & Settings */}
        <section className="lg:col-span-8 space-y-6 print:col-span-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="glass-panel border-dashed border-slate-300 text-slate-500 rounded-3xl font-medium flex flex-col items-center justify-center gap-3 hover:border-brand hover:text-brand transition-all active:scale-[0.98] print:hidden min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-light transition-colors">
                <Plus size={32} />
              </div>
              <span className="text-lg">Добавить деталь</span>
            </button>
          </div>

          <div className="mt-8 space-y-6">
            <ModelingCalculator
              hours={modelingHours}
              iterations={modelingIterations}
              complexity={modelingComplexity}
              settings={settings}
              onHoursChange={setModelingHours}
              onIterationsChange={setModelingIterations}
              onComplexityChange={setModelingComplexity}
            />
            <AdditionalServices labor={labor} onLaborChange={setLabor} />
          </div>
        </section>

        {/* Right Area - Sidebar Sticky Total */}
        <section className="lg:col-span-4 print:col-span-12 relative">
          <div className="sticky top-10 space-y-6">
            <PriceTotal results={results} />
            <DetailsSidebar results={results} />
            <ActionButtons
              copied={copied}
              pdfLoading={pdfLoading}
              onCopyReport={handleCopyReport}
              onGeneratePDF={handleGeneratePDF}
            />
          </div>
        </section>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      <footer className="mt-16 pb-8 text-slate-400 text-[10px] font-bold text-center uppercase tracking-widest print:mt-4 print:text-black">
        <p>© 2026 3D CALC PRO — MINIMAL EDITION</p>
      </footer>
    </div>
  );
};

export default App;
