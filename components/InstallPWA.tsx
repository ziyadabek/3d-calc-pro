import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export const InstallPWA: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={handleInstallClick}
            className="px-3.5 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-hover transition-all flex items-center gap-2 text-xs font-bold shadow-sm"
            title="Установить приложение"
        >
            <Download size={16} />
            <span className="hidden sm:inline">Установить</span>
        </button>
    );
};
