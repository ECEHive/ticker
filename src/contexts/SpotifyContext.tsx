import {
    exchangeCodeForToken,
    redirectToSpotifyAuthorize as redirectToSpotify,
    refreshAccessToken,
    SPOTIFY_CODE_VERIFIER_KEY,
    spotifyRequest
} from "@/api/spotify";
import type { SpotifyContextValue, SpotifyPlayerState, SpotifyToken } from "@/types";
import { getStorageItem, removeStorageItem, setStorageItem } from "@/utils/storage";
import React, { createContext, useCallback, useEffect, useState } from "react";

export const SpotifyContext = createContext<SpotifyContextValue | null>(null);

const TOKEN_STORAGE_KEY = "spotify_token";
const ENABLED_STORAGE_KEY = "spotify_enabled";

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentToken, setCurrentToken] = useState<SpotifyToken>(() => {
        return getStorageItem<SpotifyToken>(TOKEN_STORAGE_KEY, {
            access_token: null,
            refresh_token: null,
            expires_in: null,
            expires: null,
        });
    });

    const [spotifyEnabled, setSpotifyEnabledState] = useState<boolean>(() => {
        return getStorageItem<boolean>(ENABLED_STORAGE_KEY, false);
    });

    const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);

    const setSpotifyEnabled = useCallback((value: boolean) => {
        setSpotifyEnabledState(value);
        setStorageItem(ENABLED_STORAGE_KEY, value);
    }, []);

    const updateToken = useCallback((tokenData: Partial<SpotifyToken>) => {
        setCurrentToken(prev => {
            const next = { ...prev, ...tokenData };
            setStorageItem(TOKEN_STORAGE_KEY, next);
            return next;
        });
    }, []);

    const logOut = useCallback(() => {
        updateToken({
            access_token: null,
            refresh_token: null,
            expires_in: null,
            expires: null,
        });
        setPlayerState(null);
        setSpotifyEnabled(false);
        window.localStorage.removeItem(SPOTIFY_CODE_VERIFIER_KEY);
        removeStorageItem(TOKEN_STORAGE_KEY);
    }, [updateToken, setSpotifyEnabled]);

    // Initial check for OAuth code in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            const verifier = window.localStorage.getItem(SPOTIFY_CODE_VERIFIER_KEY);
            if (verifier) {
                // Clear the URL to avoid re-triggering and clean up the address bar
                window.history.replaceState({}, document.title, window.location.pathname);

                exchangeCodeForToken(code, verifier)
                    .then(res => {
                        updateToken({
                            access_token: res.access_token,
                            refresh_token: res.refresh_token,
                            expires_in: res.expires_in,
                            expires: new Date(Date.now() + res.expires_in * 1000).toISOString(),
                        });
                        setSpotifyEnabled(true);
                        // Clean up the verifier since we successfully exchanged it
                        window.localStorage.removeItem(SPOTIFY_CODE_VERIFIER_KEY);
                    })
                    .catch(err => {
                        console.error("Failed to exchange code for token:", err);
                    });
            }
        }
    }, [updateToken, setSpotifyEnabled]);

    const request = useCallback(async (endpoint: string) => {
        let token = currentToken;

        // Check if token is expired
        if (token.expires && new Date(token.expires) <= new Date() && token.refresh_token) {
            try {
                const res = await refreshAccessToken(token.refresh_token);
                token = {
                    access_token: res.access_token,
                    // The refresh token might not be returned in every refresh response
                    refresh_token: res.refresh_token || token.refresh_token,
                    expires_in: res.expires_in,
                    expires: new Date(Date.now() + res.expires_in * 1000).toISOString(),
                };
                updateToken(token);
            } catch (error) {
                console.error("Failed to refresh token:", error);
                logOut();
                throw error;
            }
        }

        if (!token.access_token) {
            throw new Error("No access token available");
        }

        return spotifyRequest(endpoint, token.access_token);
    }, [currentToken, logOut, updateToken]);

    // Poll player state periodically if enabled and authenticated
    useEffect(() => {
        if (!spotifyEnabled || !currentToken.access_token) {
            setPlayerState(null);
            return;
        }

        let isMounted = true;
        const fetchPlayer = async () => {
            try {
                const state = await request("/me/player") as SpotifyPlayerState | null;
                // If it returned 204 or empty object, state might be empty
                if (isMounted) {
                    if (state && Object.keys(state).length > 0) {
                        setPlayerState(state);
                    } else {
                        setPlayerState(null);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch player state:", err);
            }
        };

        fetchPlayer();
        const interval = setInterval(fetchPlayer, 10000); // Poll every 10s

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [spotifyEnabled, currentToken.access_token, request]);

    const redirectToSpotifyAuthorizeWrapper = useCallback(() => {
        redirectToSpotify().catch(err => {
            console.error("Failed to redirect to Spotify:", err);
        });
    }, []);

    const value: SpotifyContextValue = {
        currentToken,
        redirectToSpotifyAuthorize: redirectToSpotifyAuthorizeWrapper,
        request,
        logOut,
        playerState,
        spotifyEnabled,
        setSpotifyEnabled,
    };

    return (
        <SpotifyContext.Provider value={value}>
            {children}
        </SpotifyContext.Provider>
    );
};

