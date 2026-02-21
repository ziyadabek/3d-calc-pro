import { PrintPart, CalcResults } from '../types/index';
import { DEFAULT_MATERIALS, COMPLEXITY_MULTIPLIERS } from '../constants/index';

export function generateTextReport(parts: PrintPart[], labor: number, results: CalcResults): string {
    const partsDetails = parts.map((p) => `
🔹 ${p.name}
   ⚖️ Вес: ${p.weight} г
   ⏱ Время: ${p.hours} ч
   🧵 Материал: ${DEFAULT_MATERIALS[p.materialType].name}
   ⚙️ Сложность: ${COMPLEXITY_MULTIPLIERS[p.complexity].name}
`).join('\n');

    const surchargeText = results.minOrderSurcharge > 0
        ? `\n⚠️ Доплата до мин. заказа: ${Math.round(results.minOrderSurcharge).toLocaleString()} ₸\n------------------------------`
        : '';

    return `
📊 ОТЧЕТ 3D ПЕЧАТИ (3D Calc Pro)
------------------------------
${partsDetails}
------------------------------
🛠 Доп. услуги: ${labor.toLocaleString()} ₸
------------------------------${surchargeText}
💰 ИТОГО: ${Math.round(results.total).toLocaleString()} ₸
------------------------------
📍 Усть-Каменогорск
  `.trim();
}

export async function copyReportToClipboard(
    parts: PrintPart[],
    labor: number,
    results: CalcResults
): Promise<boolean> {
    const report = generateTextReport(parts, labor, results);

    try {
        await navigator.clipboard.writeText(report);
        return true;
    } catch (err) {
        console.error('Clipboard API failed:', err);
        // Fallback method
        try {
            const textArea = document.createElement("textarea");
            textArea.value = report;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
            alert('Не удалось скопировать отчет. Скопируйте вручную из консоли или проверьте права доступа.');
            return false;
        }
    }
}
