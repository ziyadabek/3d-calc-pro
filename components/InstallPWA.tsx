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
            className="p-3 bg-brand text-white rounded-2xl hover:bg-brand-dark transition-all flex items-center gap-2 font-bold shadow-sm"
            title="Установить приложение"
        >
            <Download size={20} />
            <span className="hidden sm:inline">Приложение</span>
        </button>
    );
};
