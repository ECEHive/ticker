import type { ApiConfig } from "@/types";

const redirectUrl =
    window.location.hostname === "127.0.0.1" ? "http://127.0.0.1:5173" : "https://ticker.hivemakerspace.com/";

export const API_CONFIG: ApiConfig = {
    webhookBase: "https://n8n.hivemakerspace.com/webhook",
    humsBase: "https://hums.hivemakerspace.com/api/rest",
    spotifyApiBase: "https://api.spotify.com/v1",
    spotifyAuthEndpoint: "https://accounts.spotify.com/authorize",
    spotifyTokenEndpoint: "https://accounts.spotify.com/api/token",
    spotifyClientId: "7fdaa0130bac49f39a77a5607d7a15fe",
    spotifyScope: "user-read-playback-state",
} as const;

export const SPOTIFY_REDIRECT_URL = redirectUrl;
