
import { MaterialType, MaterialConfig, CalcSettings, ComplexityLevel, MaterialPrices } from '../types';

export const DEFAULT_MATERIAL_PRICES: MaterialPrices = {
  [MaterialType.PLA]: 11000,
  [MaterialType.PETG]: 9000,
  [MaterialType.ABS]: 10000,
  [MaterialType.ASA]: 18000,
  [MaterialType.PA_CF]: 29000,
  [MaterialType.TPU]: 13000,
  [MaterialType.CUSTOM]: 10000
};

export const DEFAULT_MATERIALS: Record<MaterialType, MaterialConfig> = {
  [MaterialType.PLA]: { name: 'PLA', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.PLA], color: 'blue' },
  [MaterialType.PETG]: { name: 'PETG', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.PETG], color: 'emerald' },
  [MaterialType.ABS]: { name: 'ABS', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.ABS], color: 'amber' },
  [MaterialType.ASA]: { name: 'ASA', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.ASA], color: 'orange' },
  [MaterialType.PA_CF]: { name: 'PA-CF', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.PA_CF], color: 'red' },
  [MaterialType.TPU]: { name: 'TPU', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.TPU], color: 'purple' },
  [MaterialType.CUSTOM]: { name: 'Свой пластик', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.CUSTOM], color: 'slate' }
};

export const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, { name: string, factor: number }> = {
  [ComplexityLevel.SIMPLE]: { name: 'Простая (Тех. детали)', factor: 1.0 },
  [ComplexityLevel.NORMAL]: { name: 'Средняя (Стандарт)', factor: 1.1 },
  [ComplexityLevel.HARD]: { name: 'Сложная (Поддержки)', factor: 1.3 },
  [ComplexityLevel.ULTRA]: { name: 'Ультра (Фигурки)', factor: 1.6 }
};

export const DEFAULT_SETTINGS: CalcSettings = {
  amortizationPerHour: 250,
  electricityPerHour: 40,
  markupPercent: 15,
  materialPrices: { ...DEFAULT_MATERIAL_PRICES }
};
