import { useState, useEffect } from 'react';
import { PrintPart, MaterialType, ComplexityLevel, CalcSettings } from '../types/index';
import { DEFAULT_MATERIALS } from '../constants/index';

const PARTS_STORAGE_KEY = '3dcalcpro_draft_parts';

function createDefaultPart(settings: CalcSettings, index: number = 1): PrintPart {
    return {
        id: index === 1 ? '1' : crypto.randomUUID(),
        name: `Деталь ${index}`,
        weight: 0,
        hours: 0,
        quantity: 1,
        materialType: MaterialType.PLA,
        materialPrice: settings.materialPrices?.[MaterialType.PLA] ?? DEFAULT_MATERIALS[MaterialType.PLA].pricePerKg,
        complexity: ComplexityLevel.NORMAL
    };
}

function loadPartsFromStorage(settings: CalcSettings): PrintPart[] {
    try {
        const stored = localStorage.getItem(PARTS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map((p, idx) => ({
                    id: p.id || String(idx + 1),
                    name: p.name || `Деталь ${idx + 1}`,
                    weight: Number(p.weight) || 0,
                    hours: Number(p.hours) || 0,
                    quantity: Math.max(1, Number(p.quantity) || 1),
                    materialType: p.materialType || MaterialType.PLA,
                    materialPrice: p.materialType === MaterialType.CUSTOM && p.materialPrice
                        ? Number(p.materialPrice)
                        : (settings.materialPrices[p.materialType as MaterialType] ?? DEFAULT_MATERIALS[MaterialType.PLA].pricePerKg),
                    complexity: p.complexity || ComplexityLevel.NORMAL
                }));
            }
        }
    } catch (e) {
        console.warn('Failed to load draft parts:', e);
    }
    return [createDefaultPart(settings, 1)];
}

export function useParts(settings: CalcSettings) {
    const [parts, setParts] = useState<PrintPart[]>(() => loadPartsFromStorage(settings));

    // Sync material prices when settings prices change (keep custom price if CUSTOM is selected)
    useEffect(() => {
        setParts(prev => prev.map(p => {
            if (p.materialType === MaterialType.CUSTOM) {
                return p;
            }
            return {
                ...p,
                materialPrice: settings.materialPrices[p.materialType]
            };
        }));
    }, [settings.materialPrices]);

    // Persist draft parts to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(PARTS_STORAGE_KEY, JSON.stringify(parts));
        } catch (e) {
            console.warn('Failed to save draft parts:', e);
        }
    }, [parts]);

    const addPart = () => {
        setParts(prev => [
            ...prev,
            createDefaultPart(settings, prev.length + 1)
        ]);
    };

    const duplicatePart = (id: string) => {
        setParts(prev => {
            const index = prev.findIndex(p => p.id === id);
            if (index === -1) return prev;
            const source = prev[index];
            const copy: PrintPart = {
                ...source,
                id: crypto.randomUUID(),
                name: `${source.name} (копия)`
            };
            const next = [...prev];
            next.splice(index + 1, 0, copy);
            return next;
        });
    };

    const removePart = (id: string) => {
        if (parts.length > 1) {
            setParts(prev => prev.filter(p => p.id !== id));
        }
    };

    const resetParts = () => {
        setParts([createDefaultPart(settings, 1)]);
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
                const newMat = value as MaterialType;
                updates.materialPrice = settings.materialPrices[newMat];
            }

            return { ...p, ...updates };
        }));
    };

    return { parts, addPart, duplicatePart, removePart, resetParts, updatePart };
}
