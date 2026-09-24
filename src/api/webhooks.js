import { safeFetch } from "./client";
import { API_CONFIG } from "./config";

export async function fetchWebhook(target) {
    return safeFetch(`${API_CONFIG.webhookBase}/${target}`);
}
