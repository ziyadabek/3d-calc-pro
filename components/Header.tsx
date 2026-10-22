import * as React from 'react';
import { useRef } from 'react';
import { Box, Settings, Eye, EyeOff, RotateCcw, Sun, Moon, LogOut } from 'lucide-react';
import { InstallPWA } from './InstallPWA';

interface HeaderProps {
    isAdmin: boolean;
    isClientMode: boolean;
    onToggleClientMode: () => void;
    onSecretLoginTrigger: () => void;
    onLogoutClick: () => void;
    isDark: boolean;
    onToggleTheme: () => void;
    onResetOrder: () => void;
    onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    isAdmin,
    isClientMode,
    onToggleClientMode,
    onSecretLoginTrigger,
    onLogoutClick,
    isDark,
    onToggleTheme,
    onResetOrder,
    onSettingsClick
}) => {
    const clickCountRef = useRef(0);
    const clickTimerRef = useRef<number | null>(null);

    const handleLogoSecretClick = () => {
        if (isAdmin) return;

        clickCountRef.current += 1;

        if (clickTimerRef.current) {
            window.clearTimeout(clickTimerRef.current);
        }

        if (clickCountRef.current >= 5) {
            clickCountRef.current = 0;
            onSecretLoginTrigger();
            return;
        }

        clickTimerRef.current = window.setTimeout(() => {
            clickCountRef.current = 0;
        }, 1500);
    };

    return (
        <header className="w-full max-w-7xl flex flex-wrap justify-between items-center gap-4 print:hidden relative z-20 glass-panel rounded-2xl p-3.5 px-5 md:px-7">
            {/* Brand Identity (Secret 5-tap trigger on logo) */}
            <div
                onClick={handleLogoSecretClick}
                className="flex items-center gap-3.5 select-none cursor-default"
            >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl text-white shadow-md shadow-blue-600/20 flex items-center justify-center">
                    <Box size={26} strokeWidth={2.2} />
                </div>
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                            3D Calc <span className="text-brand dark:text-blue-400">Pro</span>
                        </h1>
                        {isAdmin ? (
                            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                                Admin
                            </span>
                        ) : (
                            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                                Studio v2.0
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold mt-1 tracking-wide">
                        Инженерный калькулятор FDM-печати и CAD
                    </p>
                </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 md:gap-2.5 ml-auto">
                <InstallPWA />

                {/* Reset Order Button */}
                <button
                    type="button"
                    onClick={onResetOrder}
                    title="Сбросить текущий расчёт"
                    className="p-2.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-200 dark:hover:border-red-800/60 transition-all text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 text-xs font-bold"
                >
                    <RotateCcw size={16} />
                    <span className="hidden sm:inline">Сброс</span>
                </button>

                {/* Dark / Light Theme Toggle */}
                <button
                    type="button"
                    onClick={onToggleTheme}
                    title={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
                >
                    {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
                </button>

                {/* Admin-ONLY Controls (Completely invisible to clients) */}
                {isAdmin && (
                    <>
                        <button
                            type="button"
                            onClick={onToggleClientMode}
                            title={isClientMode ? 'Показать маржу и себестоимость' : 'Скрыть маржу (предпросмотр клиента)'}
                            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border ${
                                isClientMode
                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-sm'
                                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-sm'
                            }`}
                        >
                            {isClientMode ? <EyeOff size={16} /> : <Eye size={16} />}
                            <span className="hidden md:inline">
                                {isClientMode ? 'Маржа скрыта' : 'Маржа видна'}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={onSettingsClick}
                            title="Настройки цен и тарифов"
                            className="p-2.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all text-brand dark:text-blue-400"
                        >
                            <Settings size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={onLogoutClick}
                            title="Выйти из режима администратора (скрыть панель)"
                            className="p-2.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 transition-all text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-xs font-bold"
                        >
                            <LogOut size={16} />
                            <span className="hidden lg:inline">Выйти</span>
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};
