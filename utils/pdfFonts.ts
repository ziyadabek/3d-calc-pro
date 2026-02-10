import jsPDF from 'jspdf';

const FONT_URLS = [
    'https://cdn.jsdelivr.net/gh/nicholasgasior/gfonts@master/fonts/roboto/Roboto-Regular.ttf',
    'https://raw.githubusercontent.com/nicholasgasior/gfonts/master/fonts/roboto/Roboto-Regular.ttf',
];

const BOLD_FONT_URLS = [
    'https://cdn.jsdelivr.net/gh/nicholasgasior/gfonts@master/fonts/roboto/Roboto-Bold.ttf',
    'https://raw.githubusercontent.com/nicholasgasior/gfonts/master/fonts/roboto/Roboto-Bold.ttf',
];

let cachedRegular: string | null = null;
let cachedBold: string | null = null;

/**
 * Convert an ArrayBuffer to a base64 string.
 * Uses chunked processing to avoid call stack limits on large buffers.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    return btoa(binary);
}

/**
 * Try fetching a font from a list of URLs (first success wins).
 */
async function fetchFontBase64(urls: string[]): Promise<string | null> {
    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) continue;
            const buffer = await response.arrayBuffer();
            if (buffer.byteLength < 1000) continue; // too small — probably an error page
            return arrayBufferToBase64(buffer);
        } catch {
            continue;
        }
    }
    return null;
}

/**
 * Load Cyrillic-compatible fonts (Roboto Regular + Bold) into a jsPDF document.
 * Fonts are cached after first download so subsequent PDF generations are instant.
 */
export async function loadCyrillicFonts(doc: jsPDF): Promise<void> {
    try {
        // Load Regular
        if (!cachedRegular) {
            cachedRegular = await fetchFontBase64(FONT_URLS);
        }
        if (cachedRegular) {
            doc.addFileToVFS('Roboto-Regular.ttf', cachedRegular);
            doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        }

        // Load Bold
        if (!cachedBold) {
            cachedBold = await fetchFontBase64(BOLD_FONT_URLS);
        }
        if (cachedBold) {
            doc.addFileToVFS('Roboto-Bold.ttf', cachedBold);
            doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
        }

        // Set as default font
        if (cachedRegular) {
            doc.setFont('Roboto', 'normal');
        }
    } catch (error) {
        console.warn(
            '⚠️ Не удалось загрузить шрифт с поддержкой кириллицы. Кириллические символы в PDF могут отображаться некорректно.',
            error
        );
    }
}
