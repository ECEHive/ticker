import type { SpotifyTokenResponse } from "@/types";
import { generateCodeChallenge, generateRandomString } from "@/utils/crypto";
import { API_CONFIG, SPOTIFY_REDIRECT_URL } from "./config";

export const SPOTIFY_CODE_VERIFIER_KEY = "spotify_code_verifier";

/**
 * Initiates the PKCE flow by generating a code verifier and challenge,
 * then redirecting the user to the Spotify authorization endpoint.
 */
export async function redirectToSpotifyAuthorize(): Promise<void> {
    const verifier = generateRandomString(128);
    window.localStorage.setItem(SPOTIFY_CODE_VERIFIER_KEY, verifier);

    const challenge = await generateCodeChallenge(verifier);

    const params = new URLSearchParams({
        client_id: API_CONFIG.spotifyClientId,
        response_type: "code",
        redirect_uri: SPOTIFY_REDIRECT_URL,
        code_challenge_method: "S256",
        code_challenge: challenge,
        scope: API_CONFIG.spotifyScope,
    });

    window.location.href = `${API_CONFIG.spotifyAuthEndpoint}?${params.toString()}`;
}

/**
 * Exchanges an authorization code for an access token.
 */
export async function exchangeCodeForToken(code: string, verifier: string): Promise<SpotifyTokenResponse> {
    const params = new URLSearchParams({
        client_id: API_CONFIG.spotifyClientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URL,
        code_verifier: verifier,
    });

    const res = await fetch(API_CONFIG.spotifyTokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    if (!res.ok) {
        throw new Error(`Failed to exchange token: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<SpotifyTokenResponse>;
}

/**
 * Refreshes an expired access token using the refresh token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
    const params = new URLSearchParams({
        client_id: API_CONFIG.spotifyClientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    const res = await fetch(API_CONFIG.spotifyTokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    if (!res.ok) {
        throw new Error(`Failed to refresh token: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<SpotifyTokenResponse>;
}

/**
 * Makes an authenticated request to the Spotify API.
 */
export async function spotifyRequest<T>(endpoint: string, accessToken: string): Promise<T> {
    const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_CONFIG.spotifyApiBase}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Spotify API request failed: ${res.status} ${res.statusText}`);
    }

    // Handle 204 No Content which some Spotify endpoints return
    if (res.status === 204) {
        return {} as T;
    }

    const text = await res.text();
    if (!text) return {} as T;

    return JSON.parse(text) as T;
}
