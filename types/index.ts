export enum MaterialType {
  PLA = 'PLA',
  PETG = 'PETG',
  ABS = 'ABS',
  ASA = 'ASA',
  PA_CF = 'PA_CF',
  TPU = 'TPU',
  CUSTOM = 'CUSTOM'
}

export enum ComplexityLevel {
  SIMPLE = 'SIMPLE',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  ULTRA = 'ULTRA'
}

export enum ModelingComplexityLevel {
  SIMPLE = 'SIMPLE',
  NORMAL = 'NORMAL',
  PRO = 'PRO'
}

export interface MaterialConfig {
  name: string;
  pricePerKg: number;
  color: string; // UI accent color class
  badge?: string;
}

export interface PrintPart {
  id: string;
  name: string;
  weight: number; // Вес 1 детали в граммах
  hours: number;  // Время печати 1 детали в часах
  quantity: number; // Количество деталей (тираж)
  materialType: MaterialType;
  materialPrice: number; // Цена за 1 кг для этой детали
  complexity: ComplexityLevel;
}

export interface PartCalculationBreakdown {
  partId: string;
  quantity: number;
  unitWeight: number;
  unitHours: number;
  totalWeight: number;
  totalHours: number;
  materialCost: number;
  workCost: number;
  electricityCost: number;
  baseCost: number;
  markupCost: number;
  complexityBonus: number;
  unitPrice: number;
  totalPrice: number;
  pricePerGram: number;
}

export interface MaterialPrices {
  [MaterialType.PLA]: number;
  [MaterialType.PETG]: number;
  [MaterialType.ABS]: number;
  [MaterialType.ASA]: number;
  [MaterialType.PA_CF]: number;
  [MaterialType.TPU]: number;
  [MaterialType.CUSTOM]: number;
}

export interface MaterialMarkups {
  [MaterialType.PLA]: number;
  [MaterialType.PETG]: number;
  [MaterialType.ABS]: number;
  [MaterialType.ASA]: number;
  [MaterialType.PA_CF]: number;
  [MaterialType.TPU]: number;
  [MaterialType.CUSTOM]: number;
}

export interface ModelingPrices {
  [ModelingComplexityLevel.SIMPLE]: number;
  [ModelingComplexityLevel.NORMAL]: number;
  [ModelingComplexityLevel.PRO]: number;
}

export interface CalcSettings {
  amortizationPerHour: number;
  electricityPerHour: number;
  markupPercent: number; // fallback
  materialPrices: MaterialPrices;
  materialMarkups: MaterialMarkups;
  wasteFactor: number; // коэффициент брака (например, 1.1 = +10%)
  minOrderPrice: number; // минимальная цена заказа в ₸
  modelingPrices: ModelingPrices; // стоимости часа моделирования в ₸ по сложностям
  modelingPerIteration: number; // стоимость одной итерации/примерки в ₸
}

export interface CalcResults {
  materialCost: number;
  workCost: number;
  electricityCost: number;
  laborCost: number;
  modelingCost: number;
  hardwareCost: number; // Реальная себестоимость печати (пластик + принтер + свет с браком)
  subtotal: number;
  markup: number;
  complexityBonus: number;
  discountPercent: number;
  discountAmount: number;
  minOrderSurcharge: number;
  netProfit: number; // Чистый доход мастера (маржа + сложность + моделирование + работа - скидка)
  total: number;
  totalWeight: number;
  totalHours: number;
  totalQuantity: number;
  partBreakdowns: Record<string, PartCalculationBreakdown>;
}
