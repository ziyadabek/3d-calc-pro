
export enum MaterialType {
  PLA_PETG = 'PLA_PETG',
  ABS_ASA = 'ABS_ASA',
  PACF_TPU = 'PACF_TPU',
  CUSTOM = 'CUSTOM'
}

export enum ComplexityLevel {
  SIMPLE = 'SIMPLE',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  ULTRA = 'ULTRA'
}

export interface MaterialConfig {
  name: string;
  pricePerKg: number;
}

export interface CalcInputs {
  weight: number;
  hours: number;
  materialType: MaterialType;
  customMaterialPrice: number;
  complexity: ComplexityLevel;
  labor: number;
}

export interface CalcSettings {
  amortizationPerHour: number;
  electricityPerHour: number;
  markupPercent: number;
}

export interface CalcResults {
  materialCost: number;
  workCost: number;
  electricityCost: number;
  laborCost: number;
  subtotal: number;
  markup: number;
  complexityBonus: number;
  total: number;
}
