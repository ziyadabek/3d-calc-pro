import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadCyrillicFonts } from '../utils/pdfFonts';
import { PrintPart, CalcSettings, CalcResults } from '../types/index';
import { DEFAULT_MATERIALS, COMPLEXITY_MULTIPLIERS } from '../constants/index';

export async function generatePDF(
    parts: PrintPart[],
    settings: CalcSettings,
    results: CalcResults
): Promise<void> {
    const doc = new jsPDF();

    // Load Cyrillic-compatible font
    await loadCyrillicFonts(doc);

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text("3D Calc Pro", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Коммерческое предложение", 14, 26);

    doc.setDrawColor(200);
    doc.line(14, 30, 196, 30);

    // Date
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Дата: ${new Date().toLocaleDateString()}`, 14, 40);

    // Parts Table
    const tableBody = parts.map(part => {
        const matCost = (part.weight / 1000) * part.materialPrice;
        const work = part.hours * settings.amortizationPerHour;
        const elec = part.hours * settings.electricityPerHour;
        const partBase = (matCost + work + elec) * settings.wasteFactor;
        const materialMarkup = settings.materialMarkups?.[part.materialType] || settings.markupPercent;
        const partMarkup = partBase * (materialMarkup / 100);
        const factor = COMPLEXITY_MULTIPLIERS[part.complexity].factor;
        const partTotal = (partBase + partMarkup) * factor;
        return [
            part.name,
            `${part.weight}г`,
            `${part.hours}ч`,
            DEFAULT_MATERIALS[part.materialType].name,
            COMPLEXITY_MULTIPLIERS[part.complexity].name,
            `${Math.round(partTotal).toLocaleString()} ₸`
        ];
    });

    const fontStyle = doc.getFontList()['Roboto'] ? { font: 'Roboto' } : {};

    autoTable(doc, {
        startY: 50,
        head: [['Название', 'Вес', 'Время', 'Материал', 'Сложность', 'Стоимость']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], ...fontStyle },
        styles: { ...fontStyle }
    });

    const finalY = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Financial Summary
    doc.setFontSize(14);
    doc.text("Итоговый расчет", 14, finalY);

    const summaryData = [
        ['Материалы', `${Math.round(results.materialCost).toLocaleString()} ₸`],
        ['Производственные расходы', `${Math.round(results.workCost + results.electricityCost + results.markup + results.complexityBonus).toLocaleString()} ₸`],
        ['Доп. услуги', `${Math.round(results.laborCost).toLocaleString()} ₸`]
    ];

    if (results.minOrderSurcharge > 0) {
        summaryData.push(['Доплата до мин. заказа', `${Math.round(results.minOrderSurcharge).toLocaleString()} ₸`]);
    }

    summaryData.push(['ИТОГО К ОПЛАТЕ', `${Math.round(results.total).toLocaleString()} ₸`]);

    autoTable(doc, {
        startY: finalY + 5,
        body: summaryData,
        theme: 'plain',
        styles: { fontSize: 12, cellPadding: 2, ...fontStyle },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 120 },
            1: { halign: 'right' }
        },
        didParseCell: (data) => {
            if (data.row.index === summaryData.length - 1) {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.textColor = [37, 99, 235];
                data.cell.styles.fontSize = 14;
            }
        }
    });

    // Footnote for production costs
    const summaryTableEnd = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text("* Производственные расходы включают амортизацию оборудования,", 14, summaryTableEnd + 3);
    doc.text("  техническое обслуживание и контроль качества.", 14, summaryTableEnd + 7);

    doc.save("3d-calc-offer.pdf");
}
