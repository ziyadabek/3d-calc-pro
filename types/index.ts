
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

export interface PrintPart {
  id: string;
  name: string;
  weight: number;
  hours: number;
  materialType: MaterialType;
  materialPrice: number; // custom price for this part's material
  complexity: ComplexityLevel;
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
