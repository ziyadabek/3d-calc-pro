import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Copy, CheckCircle2, FileDown, Layers } from 'lucide-react';
import { ModelingComplexityLevel } from './types/index';
import { ADMIN_CONFIG } from './constants/index';
import { formatDuration } from './utils/formatters';

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
import { AdminLoginModal } from './components/AdminLoginModal';

const ORDER_META_KEY = '3dcalcpro_order_meta';
const THEME_KEY = '3dcalcpro_theme';
const ADMIN_AUTH_KEY = '3dcalcpro_admin_auth';
const ADMIN_HASHES_KEY = '3dcalcpro_admin_hashes';

interface OrderMeta {
  labor: number;
  modelingHours: number;
  modelingIterations: number;
  modelingComplexity: ModelingComplexityLevel;
  discountPercent: number;
  clientName: string;
}

function loadOrderMeta(): OrderMeta {
  try {
    const raw = localStorage.getItem(ORDER_META_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        labor: Number(parsed.labor) || 0,
        modelingHours: Number(parsed.modelingHours) || 0,
        modelingIterations: Number(parsed.modelingIterations) || 0,
        modelingComplexity: parsed.modelingComplexity || ModelingComplexityLevel.NORMAL,
        discountPercent: Number(parsed.discountPercent) || 0,
        clientName: parsed.clientName || ''
      };
    }
  } catch (e) {
    console.warn('Failed to load order meta:', e);
  }
  return {
    labor: 0,
    modelingHours: 0,
    modelingIterations: 0,
    modelingComplexity: ModelingComplexityLevel.NORMAL,
    discountPercent: 0,
    clientName: ''
  };
}

function loadAdminHashes(): { loginHash: string; passwordHash: string } {
  const codeSig = JSON.stringify(ADMIN_CONFIG);
  try {
    const savedSig = localStorage.getItem('3dcalcpro_admin_code_sig');
    if (savedSig !== codeSig) {
      localStorage.setItem('3dcalcpro_admin_code_sig', codeSig);
      localStorage.setItem(ADMIN_HASHES_KEY, codeSig);
      return { loginHash: ADMIN_CONFIG.loginHash, passwordHash: ADMIN_CONFIG.passwordHash };
    }
    const raw = localStorage.getItem(ADMIN_HASHES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.loginHash && parsed.passwordHash) {
        return { loginHash: parsed.loginHash, passwordHash: parsed.passwordHash };
      }
    }
  } catch {
    // ignore
  }
  return { loginHash: ADMIN_CONFIG.loginHash, passwordHash: ADMIN_CONFIG.passwordHash };
}

const App: React.FC = () => {
  const { settings, setSettings, resetSettings } = useSettings();
  const { parts, addPart, duplicatePart, removePart, resetParts, updatePart } = useParts(settings);

  const initialMeta = React.useMemo(() => loadOrderMeta(), []);
  const [labor, setLabor] = useState(initialMeta.labor);
  const [modelingHours, setModelingHours] = useState(initialMeta.modelingHours);
  const [modelingIterations, setModelingIterations] = useState(initialMeta.modelingIterations);
  const [modelingComplexity, setModelingComplexity] = useState<ModelingComplexityLevel>(initialMeta.modelingComplexity);
  const [discountPercent, setDiscountPercent] = useState(initialMeta.discountPercent);
  const [clientName, setClientName] = useState(initialMeta.clientName);

  // Admin Authentication State (SHA-256 hashes)
  const [adminHashes, setAdminHashes] = useState(loadAdminHashes);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true' || sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [adminClientPreview, setAdminClientPreview] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // If user is NOT admin, always force Client Mode (margins & settings completely hidden)
  const effectiveClientMode = !isAdmin || adminClientPreview;

  // Secret Keyboard Shortcut (Ctrl + Shift + A) & URL hash (#admin) listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'Ф' || e.key === 'ф')) {
        e.preventDefault();
        if (!isAdmin) {
          setIsLoginModalOpen(true);
        } else {
          setIsSettingsOpen(prev => !prev);
        }
      }
    };

    const checkHash = () => {
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        if (!isAdmin) {
          setIsLoginModalOpen(true);
        }
      }
    };

    checkHash();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkHash);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHash);
    };
  }, [isAdmin]);

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    try {
      const meta: OrderMeta = {
        labor,
        modelingHours,
        modelingIterations,
        modelingComplexity,
        discountPercent,
        clientName
      };
      localStorage.setItem(ORDER_META_KEY, JSON.stringify(meta));
    } catch {
      // ignore storage errors
    }
  }, [labor, modelingHours, modelingIterations, modelingComplexity, discountPercent, clientName]);

  const results = useCalculator(
    parts,
    labor,
    settings,
    modelingHours,
    modelingIterations,
    modelingComplexity,
    discountPercent
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleLoginSuccess = (rememberMe: boolean) => {
    setIsAdmin(true);
    setAdminClientPreview(false);
    setIsLoginModalOpen(false);
    try {
      if (rememberMe) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } else {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      }
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminClientPreview(false);
    setIsSettingsOpen(false);
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {
      // ignore
    }
  };

  const handleUpdateCredentialHashes = (loginHash: string, passwordHash: string) => {
    const next = { loginHash, passwordHash };
    setAdminHashes(next);
    try {
      localStorage.setItem(ADMIN_HASHES_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleResetOrder = () => {
    resetParts();
    setLabor(0);
    setModelingHours(0);
    setModelingIterations(0);
    setModelingComplexity(ModelingComplexityLevel.NORMAL);
    setDiscountPercent(0);
    setClientName('');
  };

  const handleCopyReport = async () => {
    const success = await copyReportToClipboard(parts, labor, results, clientName);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGeneratePDF = async () => {
    setPdfLoading(true);
    try {
      await generatePDF(parts, settings, results, clientName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Ошибка при генерации PDF. Попробуйте еще раз.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-engineering-grid p-3 sm:p-5 lg:p-8 pb-28 lg:pb-12 flex flex-col items-center print:bg-white print:p-0">
      <Header
        isAdmin={isAdmin}
        isClientMode={effectiveClientMode}
        onToggleClientMode={() => setAdminClientPreview(!adminClientPreview)}
        onSecretLoginTrigger={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onResetOrder={handleResetOrder}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Area - Parts & Services */}
        <section className="lg:col-span-8 space-y-5 print:col-span-12">
          {/* Section Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-brand dark:text-blue-400" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Детали на печать ({parts.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={addPart}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand/10 dark:bg-blue-500/15 text-brand dark:text-blue-400 hover:bg-brand hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-bold text-xs transition-all print:hidden"
            >
              <Plus size={15} />
              <span>Добавить деталь</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {parts.map((part, idx) => (
              <PartCard
                key={part.id}
                index={idx}
                part={part}
                breakdown={results.partBreakdowns[part.id]}
                canDelete={parts.length > 1}
                isClientMode={effectiveClientMode}
                settings={settings}
                onUpdate={(field, value) => updatePart(part.id, field, value)}
                onDuplicate={() => duplicatePart(part.id)}
                onDelete={() => removePart(part.id)}
              />
            ))}

            <button
              type="button"
              onClick={addPart}
              className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center justify-center gap-2.5 hover:border-brand dark:hover:border-blue-500 hover:text-brand dark:hover:text-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all active:scale-[0.99] print:hidden"
            >
              <Plus size={18} />
              <span>Добавить ещё одну деталь в заказ</span>
            </button>
          </div>

          <div className="space-y-5 pt-2">
            <ModelingCalculator
              hours={modelingHours}
              iterations={modelingIterations}
              complexity={modelingComplexity}
              settings={settings}
              onHoursChange={setModelingHours}
              onIterationsChange={setModelingIterations}
              onComplexityChange={setModelingComplexity}
            />

            <AdditionalServices
              labor={labor}
              discountPercent={discountPercent}
              clientName={clientName}
              onLaborChange={setLabor}
              onDiscountChange={setDiscountPercent}
              onClientNameChange={setClientName}
            />
          </div>
        </section>

        {/* Right Area - Sticky Financial Summary */}
        <section className="lg:col-span-4 print:col-span-12 relative">
          <div className="sticky top-6 space-y-4">
            <PriceTotal results={results} isClientMode={effectiveClientMode} />
            <ActionButtons
              copied={copied}
              pdfLoading={pdfLoading}
              onCopyReport={handleCopyReport}
              onGeneratePDF={handleGeneratePDF}
            />
            <DetailsSidebar results={results} isClientMode={effectiveClientMode} />
          </div>
        </section>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 text-white shadow-2xl print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>К оплате</span>
              {results.totalWeight > 0 && (
                <span className="text-slate-500">
                  • {Math.round(results.totalWeight)}г • {formatDuration(results.totalHours)}
                </span>
              )}
            </div>
            <div className="font-mono font-black text-2xl text-white tabular-nums leading-tight">
              {Math.round(results.total).toLocaleString('ru-RU')} <span className="text-blue-400 text-lg">₸</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className={`p-3 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
              title="Скопировать расчёт"
            >
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              <span className="hidden xs:inline">{copied ? 'Скопировано' : 'Чат'}</span>
            </button>
            <button
              type="button"
              onClick={handleGeneratePDF}
              disabled={pdfLoading}
              className="p-3 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 bg-brand hover:bg-brand-hover text-white shadow-md"
            >
              <FileDown size={18} />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secret Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        expectedLoginHash={adminHashes.loginHash}
        expectedPasswordHash={adminHashes.passwordHash}
      />

      {/* Protected Settings Modal (Only renders when isAdmin is true) */}
      {isAdmin && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          setSettings={setSettings}
          onResetDefaults={resetSettings}
          onUpdateCredentialHashes={handleUpdateCredentialHashes}
        />
      )}

      <footer className="mt-12 pb-4 text-slate-400 dark:text-slate-600 text-[11px] font-bold text-center uppercase tracking-widest print:mt-4 print:text-black">
        <p>© 2026 3D CALC PRO — ENGINEERING STUDIO EDITION • УСТЬ-КАМЕНОГОРСК</p>
      </footer>
    </div>
  );
};

export default App;
