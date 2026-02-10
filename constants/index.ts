
import { MaterialType, MaterialConfig, CalcSettings, ComplexityLevel } from '../types';

export const DEFAULT_MATERIALS: Record<MaterialType, MaterialConfig> = {
  [MaterialType.PLA_PETG]: { name: 'PLA / PETG (Обычный)', pricePerKg: 10000 },
  [MaterialType.ABS_ASA]: { name: 'ABS / ASA (Технический)', pricePerKg: 10000 },
  [MaterialType.PACF_TPU]: { name: 'PA-CF / TPU (Инженерный)', pricePerKg: 25000 },
  [MaterialType.CUSTOM]: { name: 'Свой пластик', pricePerKg: 10000 }
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
  markupPercent: 15
};
