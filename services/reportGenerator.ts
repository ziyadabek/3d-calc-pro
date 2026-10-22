import { PrintPart, CalcResults } from '../types/index';
import { DEFAULT_MATERIALS, COMPLEXITY_MULTIPLIERS } from '../constants/index';
import { formatDuration } from '../utils/formatters';

export function generateTextReport(
    parts: PrintPart[],
    labor: number,
    results: CalcResults,
    clientName: string = ''
): string {
    const headerClient = clientName.trim() ? `\n👤 Заказчик/Проект: ${clientName.trim()}` : '';

    const partsDetails = parts.map((p, idx) => {
        const bd = results.partBreakdowns[p.id];
        const qty = bd?.quantity ?? p.quantity ?? 1;
        const totalPrice = Math.round(bd?.totalPrice ?? 0).toLocaleString('ru-RU');
        const unitPrice = Math.round(bd?.unitPrice ?? 0).toLocaleString('ru-RU');
        const qtyStr = qty > 1 ? ` × ${qty} шт. (по ${unitPrice} ₸)` : '';

        return [
            `🔹 ${idx + 1}. ${p.name}${qty > 1 ? ` [${qty} шт.]` : ''}`,
            `   🧵 Материал: ${DEFAULT_MATERIALS[p.materialType].name} | ⚙️ ${COMPLEXITY_MULTIPLIERS[p.complexity].shortName}`,
            `   ⚖️ Вес: ${p.weight} г/шт | ⏱ Время: ${formatDuration(p.hours)}/шт`,
            `   💵 Стоимость: ${totalPrice} ₸${qtyStr}`
        ].join('\n');
    }).join('\n\n');

    const extraLines: string[] = [];
    if (results.modelingCost > 0) {
        extraLines.push(`🎨 3D-моделирование: ${Math.round(results.modelingCost).toLocaleString('ru-RU')} ₸`);
    }
    if (labor > 0) {
        extraLines.push(`🛠 Постобработка / Сборка: ${Math.round(labor).toLocaleString('ru-RU')} ₸`);
    }
    if (results.discountAmount > 0) {
        extraLines.push(`🎁 Скидка (${results.discountPercent}%): -${Math.round(results.discountAmount).toLocaleString('ru-RU')} ₸`);
    }
    if (results.minOrderSurcharge > 0) {
        extraLines.push(`⚠️ Доплата до мин. заказа: +${Math.round(results.minOrderSurcharge).toLocaleString('ru-RU')} ₸`);
    }

    const extraBlock = extraLines.length > 0
        ? `\n------------------------------\n${extraLines.join('\n')}`
        : '';

    return `
📊 РАСЧЕТ 3D-ПЕЧАТИ (3D Calc Pro)${headerClient}
------------------------------
${partsDetails}
------------------------------
📦 Всего деталей: ${results.totalQuantity} шт. (${Math.round(results.totalWeight)} г | ${formatDuration(results.totalHours)})${extraBlock}
==============================
💰 ИТОГО К ОПЛАТЕ: ${Math.round(results.total).toLocaleString('ru-RU')} ₸
==============================
📍 г. Усть-Каменогорск
`.trim();
}

export async function copyReportToClipboard(
    parts: PrintPart[],
    labor: number,
    results: CalcResults,
    clientName: string = ''
): Promise<boolean> {
    const report = generateTextReport(parts, labor, results, clientName);

    try {
        await navigator.clipboard.writeText(report);
        return true;
    } catch (err) {
        console.error('Clipboard API failed:', err);
        try {
            const textArea = document.createElement('textarea');
            textArea.value = report;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
            alert('Не удалось скопировать отчет. Проверьте права доступа буфера обмена.');
            return false;
        }
    }
}
