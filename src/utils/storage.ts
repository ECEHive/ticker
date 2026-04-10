/**
 * Typed localStorage helpers with silent error handling.
 */

export function getStorageItem<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function setStorageItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage full or unavailable
    }
}

export function removeStorageItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        // Fail silently
    }
}
