import type { SpotifyTokenResponse } from "@/types";
import { safeFetch } from "./client";
import { API_CONFIG, SPOTIFY_REDIRECT_URL } from "./config";

export async function exchangeSpotifyCode(code: string, codeVerifier: string): Promise<SpotifyTokenResponse | null> {
    return safeFetch<SpotifyTokenResponse>(API_CONFIG.spotifyTokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: API_CONFIG.spotifyClientId,
            grant_type: "authorization_code",
            code,
            redirect_uri: SPOTIFY_REDIRECT_URL,
            code_verifier: codeVerifier,
        }),
    });
}

export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyTokenResponse | null> {
    return safeFetch<SpotifyTokenResponse>(API_CONFIG.spotifyTokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: API_CONFIG.spotifyClientId,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });
}

export async function fetchSpotifyApi<T>(endpoint: string, accessToken: string): Promise<T | null> {
    return safeFetch<T>(`${API_CONFIG.spotifyApiBase}/${endpoint}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
}

export function buildSpotifyAuthUrl(codeChallenge: string): string {
    const authUrl = new URL(API_CONFIG.spotifyAuthEndpoint);
    authUrl.search = new URLSearchParams({
        response_type: "code",
        client_id: API_CONFIG.spotifyClientId,
        scope: API_CONFIG.spotifyScope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: SPOTIFY_REDIRECT_URL,
    }).toString();
    return authUrl.toString();
}
