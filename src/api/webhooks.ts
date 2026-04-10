import { safeFetch } from "./client";
import { API_CONFIG } from "./config";

export async function fetchWebhook<T>(target: string): Promise<T | null> {
    return safeFetch<T>(`${API_CONFIG.webhookBase}/${target}`);
}
