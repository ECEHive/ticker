/**
 * Safe fetch wrapper that never throws - returns null on failure.
 * All errors are silently logged to console for debugging.
 */
export async function safeFetch(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            console.warn(`[API] ${response.status} from ${url}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.warn(`[API] Failed to fetch ${url}:`, error);
        return null;
    }
}

/**
 * Safe fetch that returns a default value on failure.
 */
export async function safeFetchWithDefault(url, defaultValue, options) {
    const result = await safeFetch(url, options);
    return result ?? defaultValue;
}
