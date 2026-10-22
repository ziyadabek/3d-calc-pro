import { useState, useEffect } from 'react';
import { CalcSettings } from '../types/index';
import { DEFAULT_SETTINGS } from '../constants/index';

const SETTINGS_KEY = '3dcalcpro_settings';
const SETTINGS_CODE_SIGNATURE_KEY = '3dcalcpro_code_signature';

const CURRENT_CODE_SIGNATURE = JSON.stringify(DEFAULT_SETTINGS);

function loadSettingsFromStorage(): CalcSettings {
  try {
    const savedSignature = localStorage.getItem(SETTINGS_CODE_SIGNATURE_KEY);
    const stored = localStorage.getItem(SETTINGS_KEY);

    // If DEFAULT_SETTINGS in constants/index.ts was updated in code, sync with new code defaults
    if (savedSignature !== CURRENT_CODE_SIGNATURE) {
      localStorage.setItem(SETTINGS_CODE_SIGNATURE_KEY, CURRENT_CODE_SIGNATURE);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }

    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        materialPrices: { ...DEFAULT_SETTINGS.materialPrices, ...(parsed.materialPrices || {}) },
        materialMarkups: { ...DEFAULT_SETTINGS.materialMarkups, ...(parsed.materialMarkups || {}) },
        modelingPrices: { ...DEFAULT_SETTINGS.modelingPrices, ...(parsed.modelingPrices || {}) }
      };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<CalcSettings>(loadSettingsFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      localStorage.setItem(SETTINGS_CODE_SIGNATURE_KEY, CURRENT_CODE_SIGNATURE);
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  const resetSettings = () => {
    setSettings({
      ...DEFAULT_SETTINGS,
      materialPrices: { ...DEFAULT_SETTINGS.materialPrices },
      materialMarkups: { ...DEFAULT_SETTINGS.materialMarkups },
      modelingPrices: { ...DEFAULT_SETTINGS.modelingPrices }
    });
  };

  return { settings, setSettings, resetSettings };
}
