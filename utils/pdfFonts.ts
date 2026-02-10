/// <reference types="vite/client" />
import { jsPDF } from 'jspdf';

let fontsLoaded = false;

/**
 * Load Cyrillic-compatible font (Roboto Regular TTF) into jsPDF.
 * Uses local font file from public directory.
 */
export async function loadCyrillicFonts(doc: jsPDF): Promise<void> {
    if (fontsLoaded) {
        try {
            doc.setFont('Roboto', 'normal');
        } catch (e) {
            console.warn('Font not available:', e);
        }
        return;
    }

    try {
        // Load from local public directory (works both in dev and production)
        // Use import.meta.env.BASE_URL to handle Vite's base path
        const fontPath = `${import.meta.env.BASE_URL}Roboto-Regular.ttf`;
        const response = await fetch(fontPath);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        if (arrayBuffer.byteLength < 50000) {
            throw new Error(`Font file too small: ${arrayBuffer.byteLength} bytes`);
        }

        console.log(`✅ Font loaded: ${arrayBuffer.byteLength} bytes`);

        const base64 = arrayBufferToBase64(arrayBuffer);

        doc.addFileToVFS('Roboto-Regular.ttf', base64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto', 'normal');

        fontsLoaded = true;
        console.log('✅ Cyrillic font loaded successfully');

    } catch (error) {
        console.error('❌ Failed to load Cyrillic font:', error);
        console.warn('⚠️ PDF will use default font. Cyrillic characters may display incorrectly.');
    }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode(...Array.from(chunk));
    }

    return btoa(binary);
}
