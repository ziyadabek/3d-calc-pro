import { useMemo } from 'react';
import { PrintPart, CalcSettings, CalcResults } from '../types/index';
import { COMPLEXITY_MULTIPLIERS } from '../constants/index';

export function useCalculator(parts: PrintPart[], labor: number, settings: CalcSettings): CalcResults {
    return useMemo(() => {
        let totalMaterial = 0;
        let totalWork = 0;
        let totalElec = 0;
        let totalMarkup = 0;
        let totalComplexity = 0;
        let totalBase = 0;

        parts.forEach(part => {
            const matCost = (part.weight / 1000) * part.materialPrice;
            const work = part.hours * settings.amortizationPerHour;
            const elec = part.hours * settings.electricityPerHour;

            // Применяем коэффициент брака к себестоимости
            const partBase = (matCost + work + elec) * settings.wasteFactor;

            // Use individual material markup instead of global
            const materialMarkup = settings.materialMarkups?.[part.materialType] || settings.markupPercent;
            const partMarkup = partBase * (materialMarkup / 100);

            const factor = COMPLEXITY_MULTIPLIERS[part.complexity].factor;
            const partTotalBeforeComplexity = partBase + partMarkup;
            const partTotal = partTotalBeforeComplexity * factor;

            const partComplexityBonus = partTotal - partTotalBeforeComplexity;

            totalMaterial += matCost;
            totalWork += work;
            totalElec += elec;
            totalMarkup += partMarkup;
            totalComplexity += partComplexityBonus;
            totalBase += partBase;
        });

        const laborCost = labor;
        const laborMarkup = labor * (settings.markupPercent / 100);
        const calculatedTotal = totalBase + totalMarkup + totalComplexity + laborCost + laborMarkup;

        // Применяем минимальную цену заказа
        const finalTotal = Math.max(calculatedTotal, settings.minOrderPrice);

        return {
            materialCost: totalMaterial,
            workCost: totalWork,
            electricityCost: totalElec,
            laborCost: laborCost,
            subtotal: totalBase + laborCost,
            markup: totalMarkup + laborMarkup,
            complexityBonus: totalComplexity,
            total: finalTotal
        };
    }, [parts, labor, settings]);
}
