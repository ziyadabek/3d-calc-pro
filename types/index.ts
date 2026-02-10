
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

export interface MaterialConfig {
  name: string;
  pricePerKg: number;
  color: string; // UI accent color class
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

export interface MaterialPrices {
  [MaterialType.PLA]: number;
  [MaterialType.PETG]: number;
  [MaterialType.ABS]: number;
  [MaterialType.ASA]: number;
  [MaterialType.PA_CF]: number;
  [MaterialType.TPU]: number;
  [MaterialType.CUSTOM]: number;
}

export interface CalcSettings {
  amortizationPerHour: number;
  electricityPerHour: number;
  markupPercent: number;
  materialPrices: MaterialPrices;
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
