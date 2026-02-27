import React, { useState } from 'react';
import { X, Check, Settings, ChevronDown, ChevronUp, Coins, TrendingUp } from 'lucide-react';
import { CalcSettings, MaterialType } from '../types/index';
import { DEFAULT_MATERIALS } from '../constants/index';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalcSettings;
  setSettings: (settings: CalcSettings) => void;
}

const MATERIAL_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  PLA: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-500' },
  PETG: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: 'text-emerald-500' },
  ABS: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: 'text-amber-500' },
  ASA: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-500' },
  PA_CF: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', icon: 'text-red-500' },
  TPU: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', icon: 'text-purple-500' },
  CUSTOM: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-900', icon: 'text-slate-500' }
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  const [showPrices, setShowPrices] = useState(false);
  const [showMarkups, setShowMarkups] = useState(false);

  if (!isOpen) return null;

  const updateMaterialPrice = (materialType: MaterialType, price: number) => {
    setSettings({
      ...settings,
      materialPrices: {
        ...settings.materialPrices,
        [materialType]: price
      }
    });
  };

  const updateMaterialMarkup = (materialType: MaterialType, markup: number) => {
    setSettings({
      ...settings,
      materialMarkups: {
        ...settings.materialMarkups,
        [materialType]: markup
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
              <Settings size={22} />
            </div>
            Константы цен
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* General settings */}
          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white z-10">Амортизация (₸/час)</label>
            <input
              type="number"
              value={settings.amortizationPerHour}
              onChange={(e) => setSettings({ ...settings, amortizationPerHour: parseFloat(e.target.value) || 0 })}
              className="glass-input w-full px-5 py-4 rounded-xl font-bold text-lg text-slate-900"
            />
          </div>

          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white z-10">Электроэнергия (₸/час)</label>
            <input
              type="number"
              value={settings.electricityPerHour}
              onChange={(e) => setSettings({ ...settings, electricityPerHour: parseFloat(e.target.value) || 0 })}
              className="glass-input w-full px-5 py-4 rounded-xl font-bold text-lg text-slate-900"
            />
          </div>

          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-brand uppercase tracking-wider bg-white z-10">Наценка на труд (%)</label>
            <div className="relative">
              <input
                type="number"
                value={settings.markupPercent}
                onChange={(e) => setSettings({ ...settings, markupPercent: parseFloat(e.target.value) || 0 })}
                className="glass-input bg-blue-50/50 focus:ring-blue-500/30 focus:border-blue-500/50 w-full pl-5 pr-12 py-4 rounded-xl font-bold text-lg text-brand-dark"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-brand text-xl">%</span>
            </div>
            <p className="text-[10px] text-slate-400 ml-2 mt-2 font-medium">Только для доп. услуг (постобработка, сборка)</p>
          </div>

          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider bg-white z-10">Коэффициент брака</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={settings.wasteFactor}
                onChange={(e) => setSettings({ ...settings, wasteFactor: parseFloat(e.target.value) || 1.0 })}
                className="glass-input bg-amber-50/50 focus:ring-amber-500/30 focus:border-amber-500/50 w-full pl-5 pr-12 py-4 rounded-xl font-bold text-lg text-amber-900"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-amber-500 text-xl">×</span>
            </div>
            <p className="text-[10px] text-slate-400 ml-2 mt-2 font-medium">1.1 = +10% на брак и непредвиденные расходы</p>
          </div>

          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-brand uppercase tracking-wider bg-white z-10">Моделирование: Простые детали (₸/ч)</label>
            <input
              type="number"
              value={settings.modelingPrices?.SIMPLE || 0}
              onChange={(e) => setSettings({ ...settings, modelingPrices: { ...settings.modelingPrices, SIMPLE: parseFloat(e.target.value) || 0 } })}
              className="glass-input w-full px-5 py-4 rounded-xl font-bold text-lg text-brand-dark bg-blue-50/50 focus:ring-blue-500/30 focus:border-blue-500/50"
            />
          </div>

          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-brand uppercase tracking-wider bg-white z-10">Моделирование: Опытный инженер (₸/ч)</label>
            <input
              type="number"
              value={settings.modelingPrices?.NORMAL || 0}
              onChange={(e) => setSettings({ ...settings, modelingPrices: { ...settings.modelingPrices, NORMAL: parseFloat(e.target.value) || 0 } })}
              className="glass-input w-full px-5 py-4 rounded-xl font-bold text-lg text-brand-dark bg-blue-50/50 focus:ring-blue-500/30 focus:border-blue-500/50"
            />
          </div>

          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-brand uppercase tracking-wider bg-white z-10">Моделирование: Срочная/Про (₸/ч)</label>
            <input
              type="number"
              value={settings.modelingPrices?.PRO || 0}
              onChange={(e) => setSettings({ ...settings, modelingPrices: { ...settings.modelingPrices, PRO: parseFloat(e.target.value) || 0 } })}
              className="glass-input w-full px-5 py-4 rounded-xl font-bold text-lg text-brand-dark bg-blue-50/50 focus:ring-blue-500/30 focus:border-blue-500/50"
            />
          </div>

          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-brand uppercase tracking-wider bg-white z-10">Итерация моделирования (₸)</label>
            <input
              type="number"
              value={settings.modelingPerIteration || 0}
              onChange={(e) => setSettings({ ...settings, modelingPerIteration: parseFloat(e.target.value) || 0 })}
              className="glass-input w-full px-5 py-4 rounded-xl font-bold text-lg text-brand-dark bg-blue-50/50 focus:ring-blue-500/30 focus:border-blue-500/50"
            />
          </div>

          <div className="relative group/input">
            <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider bg-white z-10">Минимальная цена заказа (₸)</label>
            <input
              type="number"
              value={settings.minOrderPrice}
              onChange={(e) => setSettings({ ...settings, minOrderPrice: parseFloat(e.target.value) || 0 })}
              className="glass-input bg-emerald-50/50 focus:ring-emerald-500/30 focus:border-emerald-500/50 w-full px-5 py-4 rounded-xl font-bold text-lg text-emerald-900"
            />
            <p className="text-[10px] text-slate-400 ml-2 mt-2 font-medium">Защита от убыточных мелких заказов</p>
          </div>

          {/* Material prices section */}
          <div className="border-t border-slate-100 pt-6 mt-4">
            <button
              onClick={() => setShowPrices(!showPrices)}
              className="w-full flex items-center justify-between text-base font-bold text-slate-700 mb-4 hover:text-brand transition-colors"
            >
              <span className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                  <Coins size={18} />
                </div>
                Цены пластиков (₸/кг)
              </span>
              {showPrices ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            {showPrices && (
              <div className="space-y-4 transition-all duration-300">
                {Object.entries(DEFAULT_MATERIALS).map(([key, config]) => {
                  const materialType = key as MaterialType;
                  const colors = MATERIAL_COLORS[key] || MATERIAL_COLORS.CUSTOM;
                  return (
                    <div key={key} className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${colors.icon}`}>
                        {config.name}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.materialPrices[materialType] || 0}
                          onChange={(e) => updateMaterialPrice(materialType, parseFloat(e.target.value) || 0)}
                          className={`w-full pl-5 pr-16 py-3 ${colors.bg} border ${colors.border} rounded-xl outline-none font-bold text-base ${colors.text} transition-all`}
                        />
                        <span className={`absolute right-5 top-1/2 -translate-y-1/2 font-bold text-[10px] tracking-widest uppercase ${colors.icon} opacity-50`}>₸/кг</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Material markups section */}
          <div className="border-t border-slate-100 pt-6">
            <button
              onClick={() => setShowMarkups(!showMarkups)}
              className="w-full flex items-center justify-between text-base font-bold text-slate-700 mb-4 hover:text-emerald-500 transition-colors"
            >
              <span className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                  <TrendingUp size={18} />
                </div>
                Наценки на пластики (%)
              </span>
              {showMarkups ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            {showMarkups && (
              <div className="space-y-4 transition-all duration-300">
                {Object.entries(DEFAULT_MATERIALS).map(([key, config]) => {
                  const materialType = key as MaterialType;
                  const colors = MATERIAL_COLORS[key] || MATERIAL_COLORS.CUSTOM;
                  const currentPrice = settings.materialPrices[materialType] || 0;
                  const currentMarkup = settings.materialMarkups?.[materialType] || settings.markupPercent;
                  const sellPricePerGram = (currentPrice / 1000) * (1 + currentMarkup / 100);

                  return (
                    <div key={key} className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${colors.icon} flex justify-between`}>
                        <span>{config.name}</span>
                        <span className="font-normal opacity-50">
                          → {sellPricePerGram.toFixed(1)} ₸/г
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.materialMarkups?.[materialType] || 0}
                          onChange={(e) => updateMaterialMarkup(materialType, parseFloat(e.target.value) || 0)}
                          className={`w-full pl-5 pr-12 py-3 ${colors.bg} border ${colors.border} rounded-xl outline-none font-bold text-base ${colors.text} transition-all`}
                        />
                        <span className={`absolute right-5 top-1/2 -translate-y-1/2 font-black text-xs ${colors.icon} opacity-60`}>%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-3 transition-all mt-8 active:scale-[0.98]"
          >
            <Check size={20} /> ПРИМЕНИТЬ И ЗАКРЫТЬ
          </button>
        </div>
      </div>
    </div>
  );
};
