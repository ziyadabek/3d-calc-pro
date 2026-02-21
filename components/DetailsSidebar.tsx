import * as React from 'react';
import { useMemo } from 'react';
import { ShieldAlert, Layers, Clock, Cpu, Wallet, TrendingUp, AlertCircle } from 'lucide-react';
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

// Glowing premium colors
const COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#818cf8'];

export const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ results }) => {
    const chartData = useMemo(() => {
        const data = [
            { name: 'Пластик', value: results.materialCost },
            { name: 'Принтер', value: results.workCost },
            { name: 'Энергия', value: results.electricityCost },
            { name: 'Труд', value: results.laborCost },
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
                <div className="bg-slate-900 border border-slate-700/50 p-3 rounded-xl shadow-xl backdrop-blur-xl">
                    <p className="text-white font-bold text-sm tracking-wide">{payload[0].name}</p>
                    <p className="text-indigo-400 font-bold tracking-widest">{`${Math.round(payload[0].value).toLocaleString()} ₸`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between print:relative print:shadow-none print:border-none print:bg-white print:text-black">
            <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white print:text-black">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 print:hidden">
                        <ShieldAlert size={22} />
                    </div>
                    <span>Детализация</span>
                </h2>

                <div className="h-48 min-h-48 mb-6 print:hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
                    </div>
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
                                        fill={(entry as any).isEmpty ? '#1e293b' : COLORS[index % COLORS.length]}
                                        style={(entry as any).isEmpty ? {} : { filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}60)` }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                    <ResultItem icon={<Layers size={20} />} label="Материал" value={results.materialCost} color="text-blue-400" />
                    <ResultItem icon={<Clock size={20} />} label="Принтер" value={results.workCost} color="text-purple-400" />
                    <ResultItem icon={<Cpu size={20} />} label="Энергия" value={results.electricityCost} color="text-emerald-400" />
                    <ResultItem icon={<Wallet size={20} />} label="Работа" value={results.laborCost} color="text-amber-400" />
                    <ResultItem icon={<TrendingUp size={20} />} label="Наценка" value={results.markup + results.complexityBonus} color="text-indigo-400" />
                    {results.minOrderSurcharge > 0 && (
                        <ResultItem icon={<AlertCircle size={20} />} label="До мин. заказа" value={results.minOrderSurcharge} color="text-red-400" />
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center text-white font-black print:text-black">
                    <span className="text-sm uppercase opacity-50 tracking-widest text-slate-400">Себестоимость</span>
                    <span className="text-xl tracking-tighter">{Math.round(results.subtotal).toLocaleString()} ₸</span>
                </div>
            </div>
        </div>
    );
};

