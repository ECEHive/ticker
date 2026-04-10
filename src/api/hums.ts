import type { HumsResponse } from "@/types";
import { safeFetch } from "./client";
import { API_CONFIG } from "./config";

export async function fetchOpenHours(): Promise<HumsResponse | null> {
    return safeFetch<HumsResponse>(`${API_CONFIG.humsBase}/open-hours`);
}
