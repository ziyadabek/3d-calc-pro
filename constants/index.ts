import { MaterialType, MaterialConfig, CalcSettings, ComplexityLevel, ModelingComplexityLevel, MaterialPrices, MaterialMarkups } from '../types';

/**
 * 🔐 НАСТРОЙКИ ДОСТУПА АДМИНИСТРАТОРА (SHA-256 ХЭШИ)
 * По умолчанию:
 *   Логин:  admin
 *   Пароль: admin123
 *
 * Как сгенерировать свои хэши:
 * 1) Зайдите в калькулятор под админом -> Настройки -> вкладка «Пароль»
 * 2) Введите желаемый логин и пароль -> нажмите «Скопировать код для constants/index.ts»
 * 3) Вставьте скопированный блок ADMIN_CONFIG сюда!
 */
export const ADMIN_CONFIG = {
  // SHA-256 от "admin"
  loginHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  // SHA-256 от "admin123"
  passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
};

export const DEFAULT_MATERIAL_PRICES: MaterialPrices = {
  [MaterialType.PLA]: 11000,
  [MaterialType.PETG]: 9990,
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
  [MaterialType.PLA]: { name: 'PLA', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.PLA], color: 'blue', badge: 'Базовый' },
  [MaterialType.PETG]: { name: 'PETG', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.PETG], color: 'emerald', badge: 'Хит / Прочный' },
  [MaterialType.ABS]: { name: 'ABS', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.ABS], color: 'amber', badge: 'Технический' },
  [MaterialType.ASA]: { name: 'ASA', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.ASA], color: 'orange', badge: 'УФ / Улица' },
  [MaterialType.PA_CF]: { name: 'PA-CF', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.PA_CF], color: 'red', badge: 'Карбон / Инж.' },
  [MaterialType.TPU]: { name: 'TPU', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.TPU], color: 'purple', badge: 'Гибкий резина' },
  [MaterialType.CUSTOM]: { name: 'Свой пластик', pricePerKg: DEFAULT_MATERIAL_PRICES[MaterialType.CUSTOM], color: 'slate', badge: 'Своя цена' }
};

export const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, { name: string, shortName: string, factor: number, desc: string }> = {
  [ComplexityLevel.SIMPLE]: { name: 'Простая (Тех. детали)', shortName: 'Простая', factor: 1.0, desc: 'Без поддержек, базовая геометрия' },
  [ComplexityLevel.NORMAL]: { name: 'Средняя (Стандарт)', shortName: 'Стандарт', factor: 1.1, desc: 'Обычная печать, малые поддержки' },
  [ComplexityLevel.HARD]: { name: 'Сложная (Поддержки)', shortName: 'Сложная', factor: 1.3, desc: 'Много поддержек, сложный отрыв' },
  [ComplexityLevel.ULTRA]: { name: 'Ультра (Фигурки)', shortName: 'Ультра', factor: 1.6, desc: 'Высокая детализация / риск срыва' }
};

export const MODELING_COMPLEXITY_MULTIPLIERS: Record<ModelingComplexityLevel, { name: string, defaultPrice: number, description: string }> = {
  [ModelingComplexityLevel.SIMPLE]: { name: 'Минимальная (Простые детали)', defaultPrice: 4000, description: 'Базовый реверс по сломанной детали или простых кронштейнов' },
  [ModelingComplexityLevel.NORMAL]: { name: 'Средняя (Опытный инженер)', defaultPrice: 6500, description: 'Сложная геометрия, механизмы, «додумывание» конструкции' },
  [ModelingComplexityLevel.PRO]: { name: 'Профессиональная (Срочная)', defaultPrice: 10000, description: 'Сложные сборки, профессиональный реверс, срочная разработка' }
};

export const DEFAULT_SETTINGS: CalcSettings = {
  amortizationPerHour: 250,
  electricityPerHour: 40,
  markupPercent: 200,
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
