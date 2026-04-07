/**
 * Play an audio file silently - never throws or blocks the UI.
 */
export function playAudio(src: string): void {
    try {
        const audio = new Audio(src);
        audio.play().catch(() => {
            // Autoplay may be blocked by browser policy - fail silently
        });
    } catch {
        // Audio construction failed - fail silently
    }
}
