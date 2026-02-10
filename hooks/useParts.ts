import { useState, useEffect } from 'react';
import { PrintPart, MaterialType, ComplexityLevel, CalcSettings } from '../types/index';
import { DEFAULT_MATERIALS } from '../constants/index';

export function useParts(settings: CalcSettings) {
    const [parts, setParts] = useState<PrintPart[]>([
        {
            id: "1",
            name: 'Деталь 1',
            weight: 0,
            hours: 0,
            materialType: MaterialType.PLA,
            materialPrice: DEFAULT_MATERIALS[MaterialType.PLA].pricePerKg,
            complexity: ComplexityLevel.NORMAL
        }
    ]);

    // Sync material prices: when settings prices change, update existing parts
    useEffect(() => {
        setParts(prev => prev.map(p => ({
            ...p,
            materialPrice: settings.materialPrices[p.materialType]
        })));
    }, [settings.materialPrices]);

    const addPart = () => {
        setParts(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: `Деталь ${prev.length + 1}`,
                weight: 0,
                hours: 0,
                materialType: MaterialType.PLA,
                materialPrice: settings.materialPrices[MaterialType.PLA],
                complexity: ComplexityLevel.NORMAL
            }
        ]);
    };

    const removePart = (id: string) => {
        if (parts.length > 1) {
            setParts(prev => prev.filter(p => p.id !== id));
        }
    };

    const updatePart = <K extends keyof PrintPart>(
        id: string,
        field: K,
        value: PrintPart[K]
    ) => {
        setParts(prev => prev.map(p => {
            if (p.id !== id) return p;

            const updates: Partial<PrintPart> = { [field]: value };

            // Update price if material type changes
            if (field === 'materialType') {
                updates.materialPrice = settings.materialPrices[value as MaterialType];
            }

            return { ...p, ...updates };
        }));
    };

    return { parts, addPart, removePart, updatePart };
}
