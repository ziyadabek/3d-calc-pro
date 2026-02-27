import * as React from 'react';
import { useMemo } from 'react';
import { ShieldAlert, Layers, Clock, Cpu, Wallet, TrendingUp, AlertCircle, PenTool } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { CalcResults } from '../types/index';
import { ResultItem } from './ResultItem';

interface DetailsSidebarProps {
    results: CalcResults;
}

// Minimal, clean, pastel-ish colors for light theme
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ results }) => {
    const chartData = useMemo(() => {
        const data = [
            { name: 'Пластик', value: results.materialCost },
            { name: 'Принтер', value: results.workCost },
            { name: 'Энергия', value: results.electricityCost },
            { name: 'Труд', value: results.laborCost },
            { name: 'Модель', value: results.modelingCost },
            { name: 'Прибыль', value: results.markup },
            { name: 'Сложность', value: results.complexityBonus },
            { name: 'Мин. заказ', value: results.minOrderSurcharge || 0 },
        ].filter(d => d.value > 0);

        if (data.length === 0) {
            return [{ name: 'Нет данных', value: 1, isEmpty: true }];
        }

        return data;
    }, [results]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
                    <p className="text-slate-800 font-bold text-sm tracking-wide">{payload[0].name}</p>
                    <p className="text-brand font-bold tracking-widest">{`${Math.round(payload[0].value).toLocaleString()} ₸`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 print:text-black">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-500 print:hidden">
                        <ShieldAlert size={22} />
                    </div>
                    <span>Детализация</span>
                </h2>

                <div className="h-48 min-h-48 mb-6 print:hidden relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={6}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={8}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={(entry as any).isEmpty ? '#f1f5f9' : COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                    <ResultItem icon={<Layers size={20} />} label="Материал" value={results.materialCost} color="text-blue-500" />
                    <ResultItem icon={<Clock size={20} />} label="Принтер" value={results.workCost} color="text-indigo-500" />
                    <ResultItem icon={<Cpu size={20} />} label="Энергия" value={results.electricityCost} color="text-emerald-500" />
                    <ResultItem icon={<PenTool size={20} />} label="Модель" value={results.modelingCost} color="text-pink-500" />
                    <ResultItem icon={<Wallet size={20} />} label="Работа" value={results.laborCost} color="text-amber-500" />
                    <ResultItem icon={<TrendingUp size={20} />} label="Наценка" value={results.markup + results.complexityBonus} color="text-brand" />
                    {results.minOrderSurcharge > 0 && (
                        <ResultItem icon={<AlertCircle size={20} />} label="До мин. заказа" value={results.minOrderSurcharge} color="text-red-500" />
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center text-slate-800 font-black print:text-black">
                    <span className="text-sm uppercase text-slate-400 tracking-widest">Себестоимость</span>
                    <span className="text-xl tracking-tighter">{Math.round(results.subtotal).toLocaleString()} ₸</span>
                </div>
            </div>
        </div>
    );
};
