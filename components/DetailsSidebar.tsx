import * as React from 'react';
import { useMemo } from 'react';
import { ShieldAlert, Layers, Clock, Cpu, Wallet, TrendingUp } from 'lucide-react';
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

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#4f46e5'];

export const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ results }) => {
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

    return (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 sticky top-8 print:relative print:shadow-none print:border-none">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShieldAlert size={22} className="text-emerald-600 print:hidden" /> Детализация
            </h2>

            <div className="h-48 min-h-48 mb-6 print:hidden">
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
    );
};
