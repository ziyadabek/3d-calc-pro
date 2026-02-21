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

            // Apply waste factor to individual components so the breakdown matches total
            const matCostWithWaste = matCost * settings.wasteFactor;
            const workWithWaste = work * settings.wasteFactor;
            const elecWithWaste = elec * settings.wasteFactor;

            const partBase = matCostWithWaste + workWithWaste + elecWithWaste;

            // Use individual material markup instead of global
            const materialMarkup = settings.materialMarkups?.[part.materialType] || settings.markupPercent;
            const partMarkup = partBase * (materialMarkup / 100);

            const factor = COMPLEXITY_MULTIPLIERS[part.complexity].factor;
            const partTotalBeforeComplexity = partBase + partMarkup;
            const partTotal = partTotalBeforeComplexity * factor;

            const partComplexityBonus = partTotal - partTotalBeforeComplexity;

            totalMaterial += matCostWithWaste;
            totalWork += workWithWaste;
            totalElec += elecWithWaste;
            totalMarkup += partMarkup;
            totalComplexity += partComplexityBonus;
            totalBase += partBase;
        });

        const laborCost = labor;
        const calculatedTotal = totalBase + totalMarkup + totalComplexity + laborCost;

        // Применяем минимальную цену заказа
        const minOrderSurcharge = Math.max(0, settings.minOrderPrice - calculatedTotal);
        const finalTotal = calculatedTotal + minOrderSurcharge;

        return {
            materialCost: totalMaterial,
            workCost: totalWork,
            electricityCost: totalElec,
            laborCost: laborCost,
            subtotal: totalBase + laborCost,
            markup: totalMarkup,
            complexityBonus: totalComplexity,
            minOrderSurcharge: minOrderSurcharge,
            total: finalTotal
        };
    }, [parts, labor, settings]);
}
