import React, { useState, useEffect } from 'react';
import { X, Check, Settings, Coins, Cpu, PenTool, RotateCcw, KeyRound, ShieldCheck, Copy } from 'lucide-react';
import { CalcSettings, MaterialType } from '../types/index';
import { DEFAULT_MATERIALS } from '../constants/index';
import { sha256Hex } from '../utils/authHash';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalcSettings;
  setSettings: (settings: CalcSettings) => void;
  onResetDefaults: () => void;
  onUpdateCredentialHashes: (loginHash: string, passwordHash: string) => void;
}

type SettingsTab = 'materials' | 'hardware' | 'modeling' | 'security';

const MATERIAL_DOTS: Record<MaterialType, string> = {
  [MaterialType.PLA]: 'bg-blue-500',
  [MaterialType.PETG]: 'bg-emerald-500',
  [MaterialType.ABS]: 'bg-amber-500',
  [MaterialType.ASA]: 'bg-orange-500',
  [MaterialType.PA_CF]: 'bg-red-500',
  [MaterialType.TPU]: 'bg-purple-500',
  [MaterialType.CUSTOM]: 'bg-slate-500'
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  onResetDefaults,
  onUpdateCredentialHashes
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('materials');
  const [confirmReset, setConfirmReset] = useState(false);

  const [newLogin, setNewLogin] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [previewLoginHash, setPreviewLoginHash] = useState('');
  const [previewPassHash, setPreviewPassHash] = useState('');
  const [credSaved, setCredSaved] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const compute = async () => {
      const lHash = await sha256Hex(newLogin.trim() || 'admin');
      const pHash = await sha256Hex(newPassword || 'admin123');
      if (active) {
        setPreviewLoginHash(lHash);
        setPreviewPassHash(pHash);
      }
    };
    compute();
    return () => {
      active = false;
    };
  }, [newLogin, newPassword]);

  if (!isOpen) return null;

  const updateMaterialPrice = (materialType: MaterialType, price: number) => {
    setSettings({
      ...settings,
      materialPrices: {
        ...settings.materialPrices,
        [materialType]: Math.max(0, price)
      }
    });
  };

  const updateMaterialMarkup = (materialType: MaterialType, markup: number) => {
    setSettings({
      ...settings,
      materialMarkups: {
        ...settings.materialMarkups,
        [materialType]: Math.max(0, markup)
      }
    });
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    onResetDefaults();
    setConfirmReset(false);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogin.trim() || !newPassword) return;
    const lHash = await sha256Hex(newLogin.trim());
    const pHash = await sha256Hex(newPassword);
    onUpdateCredentialHashes(lHash, pHash);
    setCredSaved(true);
    setTimeout(() => setCredSaved(false), 2500);
  };

  const generatedCodeSnippet = `export const ADMIN_CONFIG = {\n  loginHash: '${previewLoginHash}',\n  passwordHash: '${previewPassHash}'\n};`;

  const handleCopyCodeSnippet = async () => {
    try {
      await navigator.clipboard.writeText(generatedCodeSnippet);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/70 rounded-xl text-brand dark:text-blue-400">
              <Settings size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Настройки цен и тарифов (Админ)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Доступно только администратору • автосохранение в браузере
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl my-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            className={`py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'materials'
                ? 'bg-white dark:bg-slate-900 text-brand dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coins size={14} />
            <span>Пластики</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hardware')}
            className={`py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'hardware'
                ? 'bg-white dark:bg-slate-900 text-brand dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu size={14} />
            <span>Принтер</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('modeling')}
            className={`py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'modeling'
                ? 'bg-white dark:bg-slate-900 text-brand dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PenTool size={14} />
            <span>CAD Тарифы</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'security'
                ? 'bg-white dark:bg-slate-900 text-brand dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound size={14} />
            <span>Пароль и Хэш</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {activeTab === 'materials' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-12 gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <div className="col-span-4">Материал</div>
                <div className="col-span-4">Закуп (₸/кг)</div>
                <div className="col-span-4">Наценка (%)</div>
              </div>

              {Object.entries(DEFAULT_MATERIALS).map(([key, config]) => {
                const materialType = key as MaterialType;
                const price = settings.materialPrices[materialType] ?? 0;
                const markup = settings.materialMarkups?.[materialType] ?? 0;
                const effectivePerGram = (price / 1000) * settings.wasteFactor * (1 + markup / 100);

                return (
                  <div
                    key={key}
                    className="grid grid-cols-12 items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800"
                  >
                    <div className="col-span-4 flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${MATERIAL_DOTS[materialType]}`} />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {config.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 pl-4">
                        ≈ {effectivePerGram.toFixed(1)} ₸/г
                      </span>
                    </div>

                    <div className="col-span-4 relative">
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={price}
                        onChange={(e) => updateMaterialPrice(materialType, parseFloat(e.target.value) || 0)}
                        className="glass-input bg-white dark:bg-slate-900 w-full pl-3 pr-10 py-2 rounded-xl font-mono font-bold text-sm"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                        ₸/кг
                      </span>
                    </div>

                    <div className="col-span-4 relative">
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={markup}
                        onChange={(e) => updateMaterialMarkup(materialType, parseFloat(e.target.value) || 0)}
                        className="glass-input bg-white dark:bg-slate-900 w-full pl-3 pr-8 py-2 rounded-xl font-mono font-bold text-sm text-brand dark:text-blue-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand dark:text-blue-400">
                        %
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'hardware' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                <label className="field-label">Амортизация принтера (₸/час)</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={settings.amortizationPerHour}
                  onChange={(e) => setSettings({ ...settings, amortizationPerHour: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Износ сопел, ремней, механики и ТО за 1 час печати
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                <label className="field-label">Электроэнергия (₸/час)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={settings.electricityPerHour}
                  onChange={(e) => setSettings({ ...settings, electricityPerHour: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Среднее потребление принтера в час по тарифу
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50">
                <label className="field-label text-amber-600 dark:text-amber-400">Коэффициент брака и запаса</label>
                <input
                  type="number"
                  min="1"
                  step="0.05"
                  value={settings.wasteFactor}
                  onChange={(e) => setSettings({ ...settings, wasteFactor: Math.max(1, parseFloat(e.target.value) || 1.0) })}
                  className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  1.10 = +10% на срывы печати, калибровку и прочистку
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50">
                <label className="field-label text-emerald-600 dark:text-emerald-400">Минимальная сумма заказа (₸)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={settings.minOrderPrice}
                  onChange={(e) => setSettings({ ...settings, minOrderPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Автоматическая доплата, если сумма заказа меньше порога
                </p>
              </div>
            </div>
          )}

          {activeTab === 'modeling' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                <label className="field-label">Простые детали (₸/час)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={settings.modelingPrices?.SIMPLE ?? 0}
                  onChange={(e) => setSettings({
                    ...settings,
                    modelingPrices: { ...settings.modelingPrices, SIMPLE: Math.max(0, parseFloat(e.target.value) || 0) }
                  })}
                  className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">Базовый реверс по образцу, простые втулки/кронштейны</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                <label className="field-label">Средняя сложность / Инженер (₸/час)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={settings.modelingPrices?.NORMAL ?? 0}
                  onChange={(e) => setSettings({
                    ...settings,
                    modelingPrices: { ...settings.modelingPrices, NORMAL: Math.max(0, parseFloat(e.target.value) || 0) }
                  })}
                  className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">Сложная геометрия, шестерни, механизмы, доработка</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                <label className="field-label">Профессиональная / Срочная (₸/час)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={settings.modelingPrices?.PRO ?? 0}
                  onChange={(e) => setSettings({
                    ...settings,
                    modelingPrices: { ...settings.modelingPrices, PRO: Math.max(0, parseFloat(e.target.value) || 0) }
                  })}
                  className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">Сборки из нескольких деталей, высокая срочность</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/50">
                <label className="field-label text-indigo-600 dark:text-indigo-400">Тестовая примерка / Итерация (₸/шт)</label>
                <input
                  type="number"
                  min="0"
                  step="200"
                  value={settings.modelingPerIteration ?? 0}
                  onChange={(e) => setSettings({ ...settings, modelingPerIteration: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Фиксированная доплата за печать чернового прототипа</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveCredentials} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2.5 text-slate-800 dark:text-white font-bold text-sm">
                  <ShieldCheck size={18} className="text-brand dark:text-blue-400" />
                  <span>Генератор и смена логина / пароля (SHA-256)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Желаемый логин</label>
                    <input
                      type="text"
                      value={newLogin}
                      onChange={(e) => setNewLogin(e.target.value)}
                      placeholder="admin"
                      className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-semibold text-sm"
                    />
                  </div>
                  <div>
                    <label className="field-label">Желаемый пароль</label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Введите новый пароль..."
                      className="glass-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl font-semibold text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Нажмите «Применить в браузере», чтобы сразу сменить пароль на этом устройстве:
                  </p>
                  <button
                    type="submit"
                    disabled={!newLogin.trim() || !newPassword}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 ${
                      credSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-brand hover:bg-brand-hover text-white'
                    }`}
                  >
                    <Check size={15} />
                    <span>{credSaved ? 'Сохранено!' : 'Применить в браузере'}</span>
                  </button>
                </div>
              </form>

              {/* Ready-to-copy SHA-256 code block for constants/index.ts */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    Защищённый SHA-256 код для вставки в constants/index.ts
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCodeSnippet}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    {codeCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{codeCopied ? 'Скопировано!' : 'Скопировать код'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-xl overflow-x-auto text-emerald-400 border border-slate-800">
                  {generatedCodeSnippet}
                </pre>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  💡 В файле <code className="text-white">constants/index.ts</code> хранятся только зашифрованные SHA-256 хэши (сам пароль в коде не светится даже на GitHub).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border ${
              confirmReset
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-red-600 dark:hover:text-red-400'
            }`}
          >
            <RotateCcw size={15} />
            <span>{confirmReset ? 'Нажмите ещё раз для сброса' : 'Сбросить цены по умолчанию'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] ml-auto"
          >
            <Check size={18} />
            <span>Сохранить и закрыть</span>
          </button>
        </div>
      </div>
    </div>
  );
};
