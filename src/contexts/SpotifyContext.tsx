import { buildSpotifyAuthUrl, exchangeSpotifyCode, fetchSpotifyApi, refreshSpotifyToken } from "@/api/spotify";
import type { SpotifyContextValue, SpotifyPlayerState, SpotifyToken, SpotifyTokenResponse } from "@/types";
import { generateCodeChallenge, generateRandomString } from "@/utils/crypto";
import { getStorageItem, removeStorageItem, setStorageItem } from "@/utils/storage";
import { dayjs } from "@/utils/time";
import { createContext, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

export const SpotifyContext = createContext<SpotifyContextValue | null>(null);

interface SpotifyProviderProps {
    children: ReactNode;
}

export function SpotifyProvider({ children }: SpotifyProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(() => getStorageItem("access_token", null));
    const [refreshTokenStr, setRefreshToken] = useState<string | null>(() => getStorageItem("refresh_token", null));
    const [expiresIn, setExpiresIn] = useState<number | null>(() => getStorageItem("expires_in", null));
    const [expires, setExpires] = useState<string | null>(() => getStorageItem("expires", null));
    const [codeVerifier, setCodeVerifier] = useState<string | null>(() => getStorageItem("code_verifier", null));

    const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
    const [spotifyEnabled, setSpotifyEnabled] = useState<boolean>(() => getStorageItem("spotify-enabled", true));

    const isRefreshing = useRef(false);

    const updateToken = useCallback((response: SpotifyTokenResponse) => {
        if (response.error) return;

        setAccessToken(response.access_token);
        setStorageItem("access_token", response.access_token);

        setRefreshToken(response.refresh_token);
        setStorageItem("refresh_token", response.refresh_token);

        setExpiresIn(response.expires_in);
        setStorageItem("expires_in", response.expires_in);

        const expiry = new Date(Date.now() + response.expires_in * 1000).toISOString();
        setExpires(expiry);
        setStorageItem("expires", expiry);
    }, []);

    const redirectToSpotifyAuthorize = useCallback(() => {
        const verifier = generateRandomString(64);
        setCodeVerifier(verifier);
        setStorageItem("code_verifier", verifier);

        generateCodeChallenge(verifier).then((challenge) => {
            window.location.href = buildSpotifyAuthUrl(challenge);
        });
    }, []);

    const request = useCallback(
        async (endpoint: string): Promise<unknown> => {
            if (!accessToken) return null;

            // Refresh if expired
            if (expires && dayjs().isAfter(dayjs(expires))) {
                if (!isRefreshing.current && refreshTokenStr) {
                    isRefreshing.current = true;
                    const token = await refreshSpotifyToken(refreshTokenStr);
                    if (token && !token.error) {
                        updateToken(token);
                    }
                    isRefreshing.current = false;
                }
                return null;
            }

            return fetchSpotifyApi(endpoint, accessToken);
        },
        [accessToken, expires, refreshTokenStr, updateToken],
    );

    const logOut = useCallback(() => {
        setAccessToken(null);
        setRefreshToken(null);
        setExpiresIn(null);
        setExpires(null);
        removeStorageItem("access_token");
        removeStorageItem("refresh_token");
        removeStorageItem("expires_in");
        removeStorageItem("expires");
    }, []);

    const handleSpotifyEnabled = useCallback((value: boolean) => {
        setSpotifyEnabled(value);
        setStorageItem("spotify-enabled", value);
    }, []);

    // Handle OAuth callback on page load
    useEffect(() => {
        const args = new URLSearchParams(window.location.search);
        const code = args.get("code");

        if (code && codeVerifier) {
            exchangeSpotifyCode(code, codeVerifier).then((token) => {
                if (token && !token.error) {
                    updateToken(token);
                }
                // Clean URL
                const url = new URL(window.location.href);
                url.searchParams.delete("code");
                const updatedUrl = url.search ? url.href : url.href.replace("?", "");
                window.history.replaceState({}, document.title, updatedUrl);
            });
        }
    }, [updateToken, codeVerifier]);

    // Poll player state
    useEffect(() => {
        if (!accessToken) return;

        const fetchPlayer = async () => {
            const state = (await request("me/player")) as SpotifyPlayerState | null;
            if (state) setPlayerState(state);
        };

        fetchPlayer();
        const interval = setInterval(fetchPlayer, 5000);
        return () => clearInterval(interval);
    }, [accessToken, request]);

    const currentToken: SpotifyToken = {
        access_token: accessToken,
        refresh_token: refreshTokenStr,
        expires_in: expiresIn,
        expires,
    };

    return (
        <SpotifyContext.Provider
            value={{
                currentToken,
                redirectToSpotifyAuthorize,
                request,
                logOut,
                playerState,
                spotifyEnabled,
                setSpotifyEnabled: handleSpotifyEnabled,
            }}
        >
            {children}
        </SpotifyContext.Provider>
    );
}
