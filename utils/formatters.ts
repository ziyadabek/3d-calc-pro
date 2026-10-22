/**
 * Formats decimal hours into human-readable Russian string, e.g.:
 * 2.75 -> "2 ч 45 мин"
 * 1.0 -> "1 ч"
 * 0.5 -> "30 мин"
 * 0 -> "0 ч"
 */
export function formatDuration(decimalHours: number): string {
    if (!decimalHours || decimalHours <= 0) return '0 ч';
    const totalMinutes = Math.round(decimalHours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h > 0 && m > 0) return `${h} ч ${m} мин`;
    if (h > 0) return `${h} ч`;
    return `${m} мин`;
}

/**
 * Splits decimal hours into integer hours and integer minutes (0-59)
 */
export function splitHoursAndMinutes(decimalHours: number): { hours: number; minutes: number } {
    if (!decimalHours || decimalHours <= 0) {
        return { hours: 0, minutes: 0 };
    }
    const totalMinutes = Math.round(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}

/**
 * Formats currency in KZT (₸)
 */
export function formatKZT(amount: number): string {
    return `${Math.round(amount).toLocaleString('ru-RU')} ₸`;
}
