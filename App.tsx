import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  Calculator,
  Settings,
  Layers,
  Clock,
  Cpu,
  Wallet,
  TrendingUp,
  ShieldAlert,
  Coins,
  Share2,
  Printer,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  FileDown
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadCyrillicFonts } from './utils/pdfFonts';

import {
  MaterialType,
  ComplexityLevel,
  PrintPart,
  CalcSettings,
  CalcResults
} from './types';
import { DEFAULT_MATERIALS, DEFAULT_SETTINGS, COMPLEXITY_MULTIPLIERS } from './constants';
import { ResultItem } from './components/ResultItem';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const [parts, setParts] = useState<PrintPart[]>([
    {
      id: "1",
      name: 'Деталь 1',
      weight: 0,
      hours: 0,
      materialType: MaterialType.PLA_PETG,
      materialPrice: DEFAULT_MATERIALS[MaterialType.PLA_PETG].pricePerKg,
      complexity: ComplexityLevel.NORMAL
    }
  ]);
  const [labor, setLabor] = useState(0);

  const [settings, setSettings] = useState<CalcSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const addPart = () => {
    setParts(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Деталь ${prev.length + 1}`,
        weight: 0,
        hours: 0,
        materialType: MaterialType.PLA_PETG,
        materialPrice: DEFAULT_MATERIALS[MaterialType.PLA_PETG].pricePerKg,
        complexity: ComplexityLevel.NORMAL
      }
    ]);
  };

  const removePart = (id: string) => {
    if (parts.length > 1) {
      setParts(prev => prev.filter(p => p.id !== id));
    }
  };

  const updatePart = (id: string, field: keyof PrintPart, value: any) => {
    setParts(prev => prev.map(p => {
      if (p.id !== id) return p;

      const updates: Partial<PrintPart> = { [field]: value };

      // Update price if material type changes
      if (field === 'materialType') {
        updates.materialPrice = DEFAULT_MATERIALS[value as MaterialType].pricePerKg;
      }

      return { ...p, ...updates };
    }));
  };

  const results: CalcResults = useMemo(() => {
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

      const partBase = matCost + work + elec;
      const partMarkup = partBase * (settings.markupPercent / 100);

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
    const finalTotal = totalBase + totalMarkup + totalComplexity + laborCost + laborMarkup;

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

  const handleCopyReport = async () => {
    const partsDetails = parts.map((p, i) => `
🔹 ${p.name}
   ⚖️ Вес: ${p.weight} г
   ⏱ Время: ${p.hours} ч
   🧵 Материал: ${DEFAULT_MATERIALS[p.materialType].name}
   ⚙️ Сложность: ${COMPLEXITY_MULTIPLIERS[p.complexity].name}
`).join('\n');

    const report = `
📊 ОТЧЕТ 3D ПЕЧАТИ (3D Calc Pro)
------------------------------
${partsDetails}
------------------------------
🛠 Доп. услуги: ${labor.toLocaleString()} ₸
------------------------------
💰 ИТОГО: ${Math.round(results.total).toLocaleString()} ₸
------------------------------
📍 Усть-Каменогорск
    `.trim();

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        alert('Не удалось скопировать отчет. Скопируйте вручную из консоли или проверьте права доступа.');
      }
    }
  };

  const handleGeneratePDF = async () => {
    setPdfLoading(true);
    try {
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
      const tableBody = parts.map(part => [
        part.name,
        `${part.weight}г`,
        `${part.hours}ч`,
        DEFAULT_MATERIALS[part.materialType].name,
        COMPLEXITY_MULTIPLIERS[part.complexity].name
      ]);

      const fontStyle = doc.getFontList()['Roboto'] ? { font: 'Roboto' } : {};

      autoTable(doc, {
        startY: 50,
        head: [['Название', 'Вес', 'Время', 'Материал', 'Сложность']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], ...fontStyle },
        styles: { ...fontStyle }
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      // Financial Summary
      doc.setFontSize(14);
      doc.text("Итоговый расчет", 14, finalY);

      const summaryData = [
        ['Материалы', `${Math.round(results.materialCost).toLocaleString()} ₸`],
        ['Работа оборудования', `${Math.round(results.workCost + results.electricityCost).toLocaleString()} ₸`],
        ['Доп. услуги', `${Math.round(results.laborCost).toLocaleString()} ₸`],
        ['Сложность и Маржа', `${Math.round(results.markup + results.complexityBonus).toLocaleString()} ₸`],
        ['ИТОГО К ОПЛАТЕ', `${Math.round(results.total).toLocaleString()} ₸`]
      ];

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
          if (data.row.index === 4) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = [37, 99, 235];
            data.cell.styles.fontSize = 14;
          }
        }
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Сгенерировано в 3D Calc Pro", 14, 280);
      doc.text("https://ziyadabek.github.io/3d-calc-pro/", 14, 285);

      doc.save("3d-calc-offer.pdf");
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Ошибка при генерации PDF. Попробуйте еще раз.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const chartData = useMemo(() => {
    const data = [
      { name: 'Пластик', value: results.materialCost },
      { name: 'Принтер', value: results.workCost },
      { name: 'Энергия', value: results.electricityCost },
      { name: 'Труд', value: results.laborCost },
      { name: 'Прибыль', value: results.markup },
      { name: 'Сложность', value: results.complexityBonus },
    ].filter(d => d.value > 0);

    if (data.length === 0) {
      return [{ name: 'Нет данных', value: 1, isEmpty: true }];
    }

    return data;
  }, [results]);

  const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#4f46e5'];

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-slate-50 print:bg-white print:p-0">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-200">
            <Calculator size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">3D Calc Pro</h1>
            <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-wider">Калькулятор Печати</p>
          </div>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-white shadow-sm border border-slate-200 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-700"
        >
          <Settings size={24} />
        </button>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ввод данных */}
        <section className="lg:col-span-7 space-y-6 print:col-span-12">

          {parts.map((part, index) => (
            <div key={part.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-200 print:shadow-none print:border-none relative group transition-all hover:shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 print:text-black">
                  <Layers size={22} className="text-blue-600 print:hidden" />
                  <input
                    type="text"
                    value={part.name}
                    onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                    className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none hover:border-slate-300 transition-colors w-48"
                  />
                </h2>
                {parts.length > 1 && (
                  <button
                    onClick={() => removePart(part.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Удалить деталь"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 uppercase ml-1">Вес (г)</label>
                    <input
                      type="number"
                      value={part.weight || ''}
                      onChange={(e) => updatePart(part.id, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg shadow-inner print:bg-white print:border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 uppercase ml-1">Время (ч)</label>
                    <input
                      type="number"
                      value={part.hours || ''}
                      onChange={(e) => updatePart(part.id, 'hours', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg shadow-inner print:bg-white print:border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 uppercase ml-1">Материал</label>
                  <select
                    value={part.materialType}
                    onChange={(e) => updatePart(part.id, 'materialType', e.target.value as MaterialType)}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg appearance-none cursor-pointer print:bg-white print:border-slate-300"
                  >
                    {Object.entries(DEFAULT_MATERIALS).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 print:hidden">
                  <label className="text-sm font-bold text-slate-600 uppercase ml-1">Цена за 1кг (₸)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={part.materialPrice || ''}
                      onChange={(e) => updatePart(part.id, 'materialPrice', parseFloat(e.target.value) || 0)}
                      className="w-full pl-4 pr-12 py-4 bg-blue-50/50 border-2 border-blue-200 rounded-2xl focus:border-blue-600 outline-none font-black text-blue-900 text-xl"
                    />
                    <Coins className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600" size={24} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 uppercase ml-1">Сложность</label>
                  <select
                    value={part.complexity}
                    onChange={(e) => updatePart(part.id, 'complexity', e.target.value as ComplexityLevel)}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold print:bg-white print:border-slate-300"
                  >
                    {Object.entries(COMPLEXITY_MULTIPLIERS).map(([key, config]) => (
                      <option key={key} value={key}>{config.name} (x{config.factor})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addPart}
            className="w-full py-4 bg-white border-2 border-dashed border-slate-300 text-slate-500 rounded-3xl font-bold flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-all active:scale-[0.99] print:hidden"
          >
            <Plus size={24} />
            Добавить деталь
          </button>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 print:shadow-none print:border-none">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wallet size={20} className="text-amber-500" />
              Дополнительные услуги
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase ml-1">Постобработка / Сборка (₸)</label>
              <input
                type="number"
                value={labor || ''}
                onChange={(e) => setLabor(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-4 bg-amber-50 border-2 border-amber-100 rounded-2xl focus:border-amber-500 outline-none font-bold text-lg shadow-inner print:bg-white print:border-slate-300 text-amber-900"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden print:bg-white print:text-black print:shadow-none print:border-2 print:border-slate-900">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-bold uppercase tracking-widest text-blue-400 print:text-slate-600">Итоговая цена</h3>
                <TrendingUp size={24} className="text-emerald-400 opacity-80 print:hidden" />
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-white tabular-nums tracking-tighter print:text-black">
                  {Math.round(results.total).toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-blue-400 opacity-80 print:text-slate-900">₸</span>
              </div>

              <div className="flex flex-wrap gap-2 print:hidden">
                <div className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 flex items-center gap-2 backdrop-blur-md">
                  <span className="text-[10px] font-black uppercase opacity-60">Маржа:</span>
                  <span className="text-emerald-400 font-bold text-sm">+{Math.round(results.markup).toLocaleString()} ₸</span>
                </div>
                {results.complexityBonus > 0 && (
                  <div className="px-3 py-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/20 flex items-center gap-2 backdrop-blur-md">
                    <span className="text-[10px] font-black uppercase opacity-60">Сложность:</span>
                    <span className="text-indigo-300 font-bold text-sm">+{Math.round(results.complexityBonus).toLocaleString()} ₸</span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-[60px] print:hidden"></div>
          </div>

          {/* Кнопки действий */}
          <div className="grid grid-cols-2 gap-3 print:hidden">
            <button
              onClick={handleCopyReport}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-base transition-all shadow-md active:scale-95 ${copied
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-slate-200'
                }`}
            >
              {copied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
              {copied ? 'Скопировано!' : 'Копировать'}
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={pdfLoading}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-base transition-all shadow-md active:scale-95 ${pdfLoading
                ? 'bg-blue-400 text-white/80 cursor-wait shadow-blue-100'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                }`}
            >
              <FileDown size={18} className={pdfLoading ? 'animate-spin' : ''} />
              {pdfLoading ? 'Загрузка...' : 'КП (PDF)'}
            </button>
          </div>
        </section>

        {/* Детализация */}
        <section className="lg:col-span-5 space-y-6 print:col-span-12">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 sticky top-8 print:relative print:shadow-none print:border-none">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldAlert size={22} className="text-emerald-600 print:hidden" /> Детализация
            </h2>

            <div className="h-48 mb-6 print:hidden">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={(entry as any).isEmpty ? '#f1f5f9' : COLORS[index % COLORS.length]}
                        stroke={(entry as any).isEmpty ? '#cbd5e1' : 'none'}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${Math.round(v)} ₸`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <ResultItem icon={<Layers size={20} />} label="Материал" value={results.materialCost} color="text-blue-600" />
              <ResultItem icon={<Clock size={20} />} label="Принтер" value={results.workCost} color="text-purple-600" />
              <ResultItem icon={<Cpu size={20} />} label="Энергия" value={results.electricityCost} color="text-emerald-600" />
              <ResultItem icon={<Wallet size={20} />} label="Работа" value={results.laborCost} color="text-amber-600" />
              <ResultItem icon={<TrendingUp size={20} />} label="Наценка" value={results.markup + results.complexityBonus} color="text-indigo-600" />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center text-slate-900 font-black">
                <span className="text-sm uppercase opacity-50">Себестоимость</span>
                <span className="text-lg">{Math.round(results.subtotal).toLocaleString()} ₸</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      <footer className="mt-12 pb-8 text-slate-400 text-[10px] font-black text-center uppercase tracking-widest print:mt-4 print:text-black">
        <p>© 2024 3D CALC PRO — Усть-Каменогорск</p>
      </footer>
    </div>
  );
};

export default App;
