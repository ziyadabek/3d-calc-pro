import { useMemo } from 'react';
import { PrintPart, CalcSettings, CalcResults, ModelingComplexityLevel, PartCalculationBreakdown } from '../types/index';
import { COMPLEXITY_MULTIPLIERS } from '../constants/index';

export function useCalculator(
    parts: PrintPart[],
    labor: number,
    settings: CalcSettings,
    modelingHours: number = 0,
    modelingIterations: number = 0,
    modelingComplexity: ModelingComplexityLevel = ModelingComplexityLevel.NORMAL,
    discountPercent: number = 0
): CalcResults {
    return useMemo(() => {
        let totalMaterial = 0;
        let totalWork = 0;
        let totalElec = 0;
        let totalMarkup = 0;
        let totalComplexity = 0;
        let totalBase = 0;
        let totalWeight = 0;
        let totalHours = 0;
        let totalQuantity = 0;

        const partBreakdowns: Record<string, PartCalculationBreakdown> = {};

        parts.forEach(part => {
            const qty = Math.max(1, Number(part.quantity) || 1);
            const unitWeight = Math.max(0, Number(part.weight) || 0);
            const unitHours = Math.max(0, Number(part.hours) || 0);

            const lineWeight = unitWeight * qty;
            const lineHours = unitHours * qty;

            const matCost = (lineWeight / 1000) * part.materialPrice;
            const work = lineHours * settings.amortizationPerHour;
            const elec = lineHours * settings.electricityPerHour;

            // Apply waste factor to individual components so the breakdown matches total
            const matCostWithWaste = matCost * settings.wasteFactor;
            const workWithWaste = work * settings.wasteFactor;
            const elecWithWaste = elec * settings.wasteFactor;

            const partBase = matCostWithWaste + workWithWaste + elecWithWaste;

            // Use ?? so 0% markup is respected and doesn't fall back to 200%
            const materialMarkup = settings.materialMarkups?.[part.materialType] ?? settings.markupPercent ?? 0;
            const partMarkup = partBase * (materialMarkup / 100);

            const factor = COMPLEXITY_MULTIPLIERS[part.complexity]?.factor ?? 1.0;
            const partTotalBeforeComplexity = partBase + partMarkup;
            const partTotal = partTotalBeforeComplexity * factor;

            const partComplexityBonus = partTotal - partTotalBeforeComplexity;
            const unitPrice = qty > 0 ? partTotal / qty : partTotal;
            const pricePerGram = lineWeight > 0 ? partTotal / lineWeight : 0;

            partBreakdowns[part.id] = {
                partId: part.id,
                quantity: qty,
                unitWeight,
                unitHours,
                totalWeight: lineWeight,
                totalHours: lineHours,
                materialCost: matCostWithWaste,
                workCost: workWithWaste,
                electricityCost: elecWithWaste,
                baseCost: partBase,
                markupCost: partMarkup,
                complexityBonus: partComplexityBonus,
                unitPrice,
                totalPrice: partTotal,
                pricePerGram
            };

            totalMaterial += matCostWithWaste;
            totalWork += workWithWaste;
            totalElec += elecWithWaste;
            totalMarkup += partMarkup;
            totalComplexity += partComplexityBonus;
            totalBase += partBase;
            totalWeight += lineWeight;
            totalHours += lineHours;
            totalQuantity += qty;
        });

        const laborCost = Math.max(0, Number(labor) || 0);
        const currentModelingPricePerHour = settings.modelingPrices?.[modelingComplexity] ?? 0;
        const modelingCost = (Math.max(0, modelingHours) * currentModelingPricePerHour) +
            (Math.max(0, modelingIterations) * (settings.modelingPerIteration ?? 0));

        const grossTotal = totalBase + totalMarkup + totalComplexity + laborCost + modelingCost;

        // Calculate discount
        const clampedDiscountPercent = Math.min(100, Math.max(0, Number(discountPercent) || 0));
        const discountAmount = grossTotal * (clampedDiscountPercent / 100);
        const totalAfterDiscount = Math.max(0, grossTotal - discountAmount);

        // Apply minimum order price ONLY when there is an actual non-zero order
        const hasAnyOrderActivity = grossTotal > 0;
        const minOrderSurcharge = hasAnyOrderActivity && clampedDiscountPercent < 100
            ? Math.max(0, settings.minOrderPrice - totalAfterDiscount)
            : 0;

        const finalTotal = totalAfterDiscount + minOrderSurcharge;

        // Hardware cost = true consumable/machine expenses (Material + Printer Amortization + Electricity, with waste)
        const hardwareCost = totalBase;
        // Net profit = Final total minus hardware cost
        const netProfit = Math.max(0, finalTotal - hardwareCost);

        return {
            materialCost: totalMaterial,
            workCost: totalWork,
            electricityCost: totalElec,
            laborCost,
            modelingCost,
            hardwareCost,
            subtotal: hardwareCost,
            markup: totalMarkup,
            complexityBonus: totalComplexity,
            discountPercent: clampedDiscountPercent,
            discountAmount,
            minOrderSurcharge,
            netProfit,
            total: finalTotal,
            totalWeight,
            totalHours,
            totalQuantity,
            partBreakdowns
        };
    }, [parts, labor, settings, modelingHours, modelingIterations, modelingComplexity, discountPercent]);
}
