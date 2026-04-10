/**
 * Safe fetch wrapper that never throws - returns null on failure.
 * All errors are silently logged to console for debugging.
 */
export async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            console.warn(`[API] ${response.status} from ${url}`);
            return null;
        }
        return (await response.json()) as T;
    } catch (error) {
        console.warn(`[API] Failed to fetch ${url}:`, error);
        return null;
    }
}

/**
 * Safe fetch that returns a default value on failure.
 */
export async function safeFetchWithDefault<T>(url: string, defaultValue: T, options?: RequestInit): Promise<T> {
    const result = await safeFetch<T>(url, options);
    return result ?? defaultValue;
}
