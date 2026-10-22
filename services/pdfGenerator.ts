import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadCyrillicFonts } from '../utils/pdfFonts';
import { formatDuration } from '../utils/formatters';
import { PrintPart, CalcSettings, CalcResults } from '../types/index';
import { DEFAULT_MATERIALS, COMPLEXITY_MULTIPLIERS } from '../constants/index';

export async function generatePDF(
    parts: PrintPart[],
    settings: CalcSettings,
    results: CalcResults,
    clientName: string = ''
): Promise<void> {
    const doc = new jsPDF();

    // Load Cyrillic-compatible font
    await loadCyrillicFonts(doc);
    const hasRoboto = Boolean(doc.getFontList()['Roboto']);
    const fontStyle = hasRoboto ? { font: 'Roboto' } : {};

    // Top Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 36, 'F');

    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('3D CALC PRO', 14, 17);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('Коммерческое предложение на 3D-печать и моделирование', 14, 25);

    // Date & Metadata on the right of the banner
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    const dateStr = `Дата: ${new Date().toLocaleDateString('ru-RU')}`;
    doc.text(dateStr, 196, 17, { align: 'right' });
    doc.text('г. Усть-Каменогорск', 196, 25, { align: 'right' });

    let currentY = 46;

    if (clientName.trim()) {
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text(`Заказчик / Проект: ${clientName.trim()}`, 14, currentY);
        currentY += 8;
    }

    // Summary badges row
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
        `Всего позиций: ${parts.length}  |  Общий тираж: ${results.totalQuantity} шт.  |  Общий вес: ${Math.round(results.totalWeight)} г  |  Общее время: ${formatDuration(results.totalHours)}`,
        14,
        currentY
    );
    currentY += 6;

    // Parts Table using unified breakdown
    const tableBody = parts.map((part, idx) => {
        const bd = results.partBreakdowns[part.id];
        const qty = bd?.quantity ?? part.quantity ?? 1;
        const unitPrice = bd?.unitPrice ?? 0;
        const totalPrice = bd?.totalPrice ?? 0;

        return [
            String(idx + 1),
            part.name || `Деталь ${idx + 1}`,
            DEFAULT_MATERIALS[part.materialType]?.name || part.materialType,
            `${part.weight} г`,
            formatDuration(part.hours),
            COMPLEXITY_MULTIPLIERS[part.complexity]?.shortName || COMPLEXITY_MULTIPLIERS[part.complexity]?.name || '',
            `${qty} шт.`,
            qty > 1 ? `${Math.round(unitPrice).toLocaleString('ru-RU')} ₸` : '—',
            `${Math.round(totalPrice).toLocaleString('ru-RU')} ₸`
        ];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['№', 'Деталь', 'Пластик', 'Вес/шт', 'Время/шт', 'Сложн.', 'Тираж', 'Цена/шт', 'Сумма']],
        body: tableBody,
        theme: 'grid',
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontSize: 9,
            ...fontStyle
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
            ...fontStyle
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            6: { halign: 'center' },
            7: { halign: 'right' },
            8: { halign: 'right' }
        }
    });

    const finalY = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

    // Financial Summary
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('Финансовая сводка заказа', 14, finalY);

    const printingTotal = results.materialCost + results.workCost + results.electricityCost + results.markup + results.complexityBonus;

    const summaryData: string[][] = [
        ['Стоимость 3D-печати деталей', `${Math.round(printingTotal).toLocaleString('ru-RU')} ₸`]
    ];

    if (results.modelingCost > 0) {
        summaryData.push(['Услуги 3D-моделирования (CAD)', `${Math.round(results.modelingCost).toLocaleString('ru-RU')} ₸`]);
    }

    if (results.laborCost > 0) {
        summaryData.push(['Постобработка / Сборка / Доп. услуги', `${Math.round(results.laborCost).toLocaleString('ru-RU')} ₸`]);
    }

    if (results.discountAmount > 0) {
        summaryData.push([`Скидка (${results.discountPercent}%)`, `-${Math.round(results.discountAmount).toLocaleString('ru-RU')} ₸`]);
    }

    if (results.minOrderSurcharge > 0) {
        summaryData.push(['Доплата до минимального заказа', `${Math.round(results.minOrderSurcharge).toLocaleString('ru-RU')} ₸`]);
    }

    summaryData.push(['ИТОГО К ОПЛАТЕ', `${Math.round(results.total).toLocaleString('ru-RU')} ₸`]);

    autoTable(doc, {
        startY: finalY + 4,
        body: summaryData,
        theme: 'plain',
        styles: { fontSize: 11, cellPadding: 2.5, ...fontStyle },
        columnStyles: {
            0: { cellWidth: 130 },
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

    const summaryTableEnd = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, summaryTableEnd + 4, 196, summaryTableEnd + 4);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('* В стоимость 3D-печати включены расходные материалы, амортизация оборудования, электроэнергия и контроль качества.', 14, summaryTableEnd + 10);

    const safeFileName = clientName.trim()
        ? `3d-calc-${clientName.trim().replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_')}.pdf`
        : '3d-calc-offer.pdf';

    doc.save(safeFileName);
}
