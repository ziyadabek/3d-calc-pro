
import React, { useState } from 'react';
import { X, Check, Settings, ChevronDown, ChevronUp, Coins } from 'lucide-react';
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
  CUSTOM: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', icon: 'text-slate-500' }
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  const [showPrices, setShowPrices] = useState(true);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings className="text-blue-600" /> Константы цен
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-6">
          {/* General settings */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 uppercase">Амортизация (₸/час)</label>
            <input
              type="number"
              value={settings.amortizationPerHour}
              onChange={(e) => setSettings({ ...settings, amortizationPerHour: parseFloat(e.target.value) || 0 })}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 uppercase">Электроэнергия (₸/час)</label>
            <input
              type="number"
              value={settings.electricityPerHour}
              onChange={(e) => setSettings({ ...settings, electricityPerHour: parseFloat(e.target.value) || 0 })}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 uppercase">Наценка (%)</label>
            <div className="relative">
              <input
                type="number"
                value={settings.markupPercent}
                onChange={(e) => setSettings({ ...settings, markupPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-5 py-4 bg-blue-50 border-2 border-blue-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg text-blue-900"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-blue-400 text-xl">%</span>
            </div>
          </div>

          {/* Material prices section */}
          <div className="border-t border-slate-100 pt-6">
            <button
              onClick={() => setShowPrices(!showPrices)}
              className="w-full flex items-center justify-between text-lg font-black text-slate-800 mb-4 hover:text-blue-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Coins size={22} className="text-blue-600" />
                Цены пластиков (₸/кг)
              </span>
              {showPrices ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showPrices && (
              <div className="space-y-3 animate-in slide-in-from-top-2">
                {Object.entries(DEFAULT_MATERIALS).map(([key, config]) => {
                  const materialType = key as MaterialType;
                  const colors = MATERIAL_COLORS[key] || MATERIAL_COLORS.CUSTOM;
                  return (
                    <div key={key} className="space-y-1">
                      <label className={`text-xs font-black uppercase tracking-wider ${colors.icon}`}>
                        {config.name}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.materialPrices[materialType] || 0}
                          onChange={(e) => updateMaterialPrice(materialType, parseFloat(e.target.value) || 0)}
                          className={`w-full pl-4 pr-16 py-3 ${colors.bg} border-2 ${colors.border} rounded-xl focus:ring-2 focus:ring-blue-200 outline-none font-bold text-base ${colors.text} transition-all`}
                        />
                        <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs ${colors.icon} opacity-70`}>₸/кг</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all mt-4"
          >
            <Check size={24} /> ПРИМЕНИТЬ
          </button>
        </div>
      </div>
    </div>
  );
};
