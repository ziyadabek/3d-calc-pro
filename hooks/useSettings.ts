import { useState, useEffect } from 'react';
import { CalcSettings } from '../types/index';
import { DEFAULT_SETTINGS } from '../constants/index';

const SETTINGS_KEY = '3dcalcpro_settings';

function loadSettingsFromStorage(): CalcSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure materialPrices and materialMarkups have all keys
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

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  return { settings, setSettings };
}
