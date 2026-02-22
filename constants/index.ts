
import { MaterialType, MaterialConfig, CalcSettings, ComplexityLevel, ModelingComplexityLevel, MaterialPrices, MaterialMarkups } from '../types';

export const DEFAULT_MATERIAL_PRICES: MaterialPrices = {
  [MaterialType.PLA]: 11000,
  [MaterialType.PETG]: 8500, // 17000₸ за 2кг
  [MaterialType.ABS]: 10000,
  [MaterialType.ASA]: 18000,
  [MaterialType.PA_CF]: 29000,
  [MaterialType.TPU]: 13000,
  [MaterialType.CUSTOM]: 10000
};

export const DEFAULT_MATERIAL_MARKUPS: MaterialMarkups = {
  [MaterialType.PLA]: 200,      // 11₸ → ~33₸/г
  [MaterialType.PETG]: 225,     // 8.5₸ → ~27₸/г
  [MaterialType.ABS]: 180,      // 10₸ → ~28₸/г
  [MaterialType.ASA]: 150,      // 18₸ → ~45₸/г
  [MaterialType.PA_CF]: 210,    // 29₸ → ~90₸/г
  [MaterialType.TPU]: 170,      // 13₸ → ~35₸/г
  [MaterialType.CUSTOM]: 150
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

export const MODELING_COMPLEXITY_MULTIPLIERS: Record<ModelingComplexityLevel, { name: string, defaultPrice: number, description: string }> = {
  [ModelingComplexityLevel.SIMPLE]: { name: 'Минимальная (Простые детали)', defaultPrice: 4000, description: 'Базовый реверс по сломанной детали или простых кронштейнов' },
  [ModelingComplexityLevel.NORMAL]: { name: 'Средняя (Опытный инженер)', defaultPrice: 6500, description: 'Сложная геометрия, механизмы, «додумывание» конструкции' },
  [ModelingComplexityLevel.PRO]: { name: 'Профессиональная (Срочная)', defaultPrice: 10000, description: 'Сложные сборки, профессиональный реверс, срочная разработка' }
};

export const DEFAULT_SETTINGS: CalcSettings = {
  amortizationPerHour: 250,
  electricityPerHour: 40,
  markupPercent: 200, // deprecated but kept for backwards compat
  materialPrices: { ...DEFAULT_MATERIAL_PRICES },
  materialMarkups: { ...DEFAULT_MATERIAL_MARKUPS },
  wasteFactor: 1.1, // +10% на брак и непредвиденные расходы
  minOrderPrice: 2000, // минимум 2000₸ за заказ
  modelingPrices: {
    [ModelingComplexityLevel.SIMPLE]: 4000,
    [ModelingComplexityLevel.NORMAL]: 6500,
    [ModelingComplexityLevel.PRO]: 10000
  },
  modelingPerIteration: 1000 // стоимость одной итерации по умолчанию
};
