
import React from 'react';
import { X, Check, Settings, Clock, Cpu, TrendingUp } from 'lucide-react';
import { CalcSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalcSettings;
  setSettings: (settings: CalcSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings className="text-blue-600" /> Константы цен
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 uppercase">Амортизация (₸/час)</label>
            <input 
              type="number" 
              value={settings.amortizationPerHour}
              onChange={(e) => setSettings({...settings, amortizationPerHour: parseFloat(e.target.value) || 0})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 uppercase">Электроэнергия (₸/час)</label>
            <input 
              type="number" 
              value={settings.electricityPerHour}
              onChange={(e) => setSettings({...settings, electricityPerHour: parseFloat(e.target.value) || 0})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 uppercase">Наценка (%)</label>
            <div className="relative">
              <input 
                type="number" 
                value={settings.markupPercent}
                onChange={(e) => setSettings({...settings, markupPercent: parseFloat(e.target.value) || 0})}
                className="w-full px-5 py-4 bg-blue-50 border-2 border-blue-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg text-blue-900"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-blue-400 text-xl">%</span>
            </div>
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
