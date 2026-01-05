import { format } from 'date-fns';

export function formatLocalDate(date: Date): string {
    return date.toLocaleDateString("sv-SE"); // sv-SE → format YYYY-MM-DD
}

/**
 * Convertit une string YYYY-MM-DD en Date locale (minuit local)
 */
export function parseLocalDate(value: string): Date {
    return new Date(value + "T00:00:00");
}

/**
 * Formatte en toute sécurité une string YYYY-MM-DD en texte lisible
 * Ex: "2025-08-25" → "Aug 25, 2025" (selon le pattern fourni)
 */
export function safeFormat(
    value?: string,
    pattern: string = "PPP"
): string | null {
    if (!value) return null;
    const date = parseLocalDate(value);
    if (isNaN(date.getTime())) return null;
    return format(date, pattern);
}
