import React, { useState } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { sha256Hex } from '../utils/authHash';

interface AdminLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (rememberMe: boolean) => void;
    expectedLoginHash: string;
    expectedPasswordHash: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    expectedLoginHash,
    expectedPasswordHash
}) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputLoginHash = await sha256Hex(login.trim());
        const inputPassHash = await sha256Hex(password);

        if (inputLoginHash === expectedLoginHash && inputPassHash === expectedPasswordHash) {
            setError('');
            setLogin('');
            setPassword('');
            onSuccess(rememberMe);
        } else {
            setError('Неверный логин или пароль администратора');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3.5 mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/80 rounded-2xl text-brand dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            Вход для администратора
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Доступ к марже, себестоимости и настройкам цен
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/70 text-red-600 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="field-label flex items-center gap-1.5">
                            <User size={12} className="text-slate-400" />
                            Логин администратора
                        </label>
                        <input
                            type="text"
                            autoFocus
                            value={login}
                            onChange={(e) => {
                                setLogin(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Введите логин"
                            className="glass-input w-full px-4 py-3 rounded-xl font-semibold text-sm"
                        />
                    </div>

                    <div>
                        <label className="field-label flex items-center gap-1.5">
                            <KeyRound size={12} className="text-slate-400" />
                            Пароль
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                placeholder="Введите пароль"
                                className="glass-input w-full pl-4 pr-11 py-3 rounded-xl font-semibold text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                        />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Запомнить вход на этом устройстве
                        </span>
                    </label>

                    <button
                        type="submit"
                        className="w-full py-3.5 px-5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] mt-2"
                    >
                        <ShieldCheck size={18} />
                        <span>Войти в режим мастера</span>
                    </button>
                </form>
            </div>
        </div>
    );
};
