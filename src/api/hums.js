import { safeFetch } from "./client";
import { API_CONFIG } from "./config";

export async function fetchOpenHours() {
    return safeFetch(`${API_CONFIG.humsBase}/open-hours`);
}
