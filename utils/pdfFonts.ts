/// <reference types="vite/client" />
import { jsPDF } from 'jspdf';

let fontBase64Cache: string | null = null;

/**
 * Load Cyrillic-compatible font (Roboto Regular TTF) into jsPDF.
 * Uses local font file from public directory.
 * Caches font data for reuse across multiple PDF instances.
 */
export async function loadCyrillicFonts(doc: jsPDF): Promise<void> {
    try {
        // If we don't have cached font data, fetch it
        if (!fontBase64Cache) {
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
            fontBase64Cache = arrayBufferToBase64(arrayBuffer);
        }

        // Add font to THIS document instance (even if cached)
        // This ensures every new jsPDF instance gets the font
        doc.addFileToVFS('Roboto-Regular.ttf', fontBase64Cache);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto', 'normal');

        console.log('✅ Cyrillic font registered in PDF');

    } catch (error) {
        console.error('❌ Failed to load Cyrillic font:', error);
        console.warn('⚠️ PDF will use default font. Cyrillic characters may display incorrectly.');
        // Don't throw - let PDF generation continue with default font
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
