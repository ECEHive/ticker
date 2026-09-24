/**
 * Typed localStorage helpers with silent error handling.
 */

export function getStorageItem(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage full or unavailable
    }
}

export function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        // Fail silently
    }
}
