import * as React from 'react';
import { useMemo } from 'react';
import { PieChart as PieChartIcon, Layers, Clock, Cpu, Wrench, TrendingUp, AlertCircle, PenTool, Percent } from 'lucide-react';
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
    isClientMode: boolean;
}

interface BreakdownSlice {
    key: string;
    name: string;
    value: number;
    hex: string;
    textColor: string;
    icon: React.ReactNode;
    isEmpty?: boolean;
}

export const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ results, isClientMode }) => {
    const slices: BreakdownSlice[] = useMemo(() => {
        if (isClientMode) {
            const printTotal = results.materialCost + results.workCost + results.electricityCost + results.markup + results.complexityBonus;
            return [
                {
                    key: 'print',
                    name: '3D-печать деталей',
                    value: printTotal,
                    hex: '#2563eb',
                    textColor: 'text-blue-600 dark:text-blue-400',
                    icon: <Layers size={16} />
                },
                {
                    key: 'modeling',
                    name: '3D-моделирование (CAD)',
                    value: results.modelingCost,
                    hex: '#6366f1',
                    textColor: 'text-indigo-600 dark:text-indigo-400',
                    icon: <PenTool size={16} />
                },
                {
                    key: 'labor',
                    name: 'Постобработка и сборка',
                    value: results.laborCost,
                    hex: '#f59e0b',
                    textColor: 'text-amber-500 dark:text-amber-400',
                    icon: <Wrench size={16} />
                },
                {
                    key: 'minOrder',
                    name: 'Доплата до мин. заказа',
                    value: results.minOrderSurcharge,
                    hex: '#ef4444',
                    textColor: 'text-red-500 dark:text-red-400',
                    icon: <AlertCircle size={16} />
                }
            ];
        }

        return [
            {
                key: 'material',
                name: 'Пластик (с уч. брака)',
                value: results.materialCost,
                hex: '#3b82f6', // blue-500
                textColor: 'text-blue-500',
                icon: <Layers size={16} />
            },
            {
                key: 'printer',
                name: 'Амортизация принтера',
                value: results.workCost,
                hex: '#6366f1', // indigo-500
                textColor: 'text-indigo-500',
                icon: <Clock size={16} />
            },
            {
                key: 'electricity',
                name: 'Электроэнергия',
                value: results.electricityCost,
                hex: '#10b981', // emerald-500
                textColor: 'text-emerald-500',
                icon: <Cpu size={16} />
            },
            {
                key: 'modeling',
                name: '3D-моделирование',
                value: results.modelingCost,
                hex: '#ec4899', // pink-500
                textColor: 'text-pink-500',
                icon: <PenTool size={16} />
            },
            {
                key: 'labor',
                name: 'Постобработка / Труд',
                value: results.laborCost,
                hex: '#f59e0b', // amber-500
                textColor: 'text-amber-500',
                icon: <Wrench size={16} />
            },
            {
                key: 'markup',
                name: 'Маржа и сложность',
                value: results.markup + results.complexityBonus,
                hex: '#8b5cf6', // violet-500
                textColor: 'text-violet-500',
                icon: <TrendingUp size={16} />
            },
            {
                key: 'minOrder',
                name: 'До мин. заказа',
                value: results.minOrderSurcharge,
                hex: '#ef4444', // red-500
                textColor: 'text-red-500',
                icon: <AlertCircle size={16} />
            }
        ];
    }, [results, isClientMode]);

    const chartData = useMemo(() => {
        const active = slices.filter(s => s.value > 0);
        if (active.length === 0) {
            return [{
                key: 'empty',
                name: 'Нет данных',
                value: 1,
                hex: '#cbd5e1',
                textColor: 'text-slate-400',
                icon: null,
                isEmpty: true
            }];
        }
        return active;
    }, [slices]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length && !payload[0].payload.isEmpty) {
            return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 px-3.5 rounded-xl shadow-lg">
                    <p className="text-slate-700 dark:text-slate-200 font-bold text-xs">{payload[0].name}</p>
                    <p className="text-brand dark:text-blue-400 font-mono font-extrabold text-sm mt-0.5">
                        {`${Math.round(payload[0].value).toLocaleString('ru-RU')} ₸`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base md:text-lg font-bold flex items-center gap-2.5 text-slate-900 dark:text-white print:text-black">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 print:hidden">
                            <PieChartIcon size={18} />
                        </div>
                        <span>{isClientMode ? 'Состав стоимости' : 'Детализация расчёта'}</span>
                    </h2>
                </div>

                {/* Donut Chart */}
                <div className="h-44 min-h-44 mb-4 print:hidden relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={52}
                                outerRadius={76}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={6}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${entry.key}-${index}`}
                                        fill={entry.hex}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Synchronized Breakdown List */}
                <div className="space-y-2">
                    {slices.map((slice) => {
                        if (slice.key === 'minOrder' && slice.value <= 0) return null;
                        if (isClientMode && slice.value <= 0 && slice.key !== 'print') return null;
                        return (
                            <ResultItem
                                key={slice.key}
                                icon={slice.icon}
                                label={slice.name}
                                value={slice.value}
                                color={slice.textColor}
                                dotColor={slice.value > 0 ? slice.hex : undefined}
                            />
                        );
                    })}

                    {results.discountAmount > 0 && (
                        <ResultItem
                            icon={<Percent size={16} />}
                            label={`Скидка (${results.discountPercent}%)`}
                            value={results.discountAmount}
                            color="text-emerald-600 dark:text-emerald-400"
                            isNegative
                        />
                    )}
                </div>
            </div>

            {!isClientMode && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 text-xs font-semibold">
                        <span>Себестоимость (расходники):</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {Math.round(results.hardwareCost).toLocaleString('ru-RU')} ₸
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-900 dark:text-white font-bold">
                        <span className="text-xs uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                            Чистый доход со заказа:
                        </span>
                        <span className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                            +{Math.round(results.netProfit).toLocaleString('ru-RU')} ₸
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
