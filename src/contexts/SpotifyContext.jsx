import { useLocalStorage } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import { createContext, useCallback, useEffect, useState } from "react";

export const SpotifyContext = createContext();

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = "user-read-playback-state";

const clientId = "7fdaa0130bac49f39a77a5607d7a15fe"; // your clientId

// detect if running locally or on the regular url
const redirectUrl =
    window.location.hostname === "127.0.0.1" ? "http://127.0.0.1:5173" : "https://ticker.hivemakerspace.com/";

// eslint-disable-next-line react/prop-types
export const SpotifyProvider = ({ children }) => {
    const {
        currentToken,
        redirectToSpotifyAuthorize,
        // refreshToken,
        request,
        logOut,
    } = useProvideSpotify();
    const playerState = usePlayerState(request);
    const [spotifyEnabled, setSpotifyEnabled] = useLocalStorage("spotify-enabled", true);

    return (
        <SpotifyContext.Provider
            value={{
                currentToken,
                redirectToSpotifyAuthorize,
                request,
                logOut,
                playerState,
                spotifyEnabled,
                setSpotifyEnabled,
            }}
        >
            {children}
        </SpotifyContext.Provider>
    );
};

function usePlayerState(request) {
    const [playerState, setPlayerState] = useState();

    useEffect(() => {
        const interval = setInterval(() => {
            request("me/player").then((resp) => {
                setPlayerState(resp);
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [request]);

    return playerState;
}

function useProvideSpotify() {
    // Data structure that manages the current active token, caching it in localStorage
    const [access_token, set_access_token] = useLocalStorage("access_token");
    const [refresh_token, set_refresh_token] = useLocalStorage("refresh_token");
    const [expires_in, set_expires_in] = useLocalStorage("expires_in");
    const [expires, set_expires] = useLocalStorage("expires");
    const [code_verifier, set_code_verifier] = useLocalStorage("code_verifier");

    const updateToken = useCallback(
        (response) => {
            const { access_token, refresh_token, expires_in } = response;
            set_access_token(access_token);
            set_refresh_token(refresh_token);
            set_expires_in(expires_in);

            const now = new Date();
            const expiry = new Date(now.getTime() + expires_in * 1000);
            set_expires(expiry);
        },
        [set_access_token, set_expires, set_expires_in, set_refresh_token],
    );

    function redirectToSpotifyAuthorize() {
        const generateRandomString = (length) => {
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        };

        const codeVerifier = generateRandomString(64);

        const sha256 = async (plain) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            return window.crypto.subtle.digest("SHA-256", data);
        };

        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_");
        };

        sha256(codeVerifier).then((hashed) => {
            const codeChallenge = base64encode(hashed);

            set_code_verifier(codeVerifier);

            const authUrl = new URL(authorizationEndpoint);
            const params = {
                response_type: "code",
                client_id: clientId,
                scope: scope,
                code_challenge_method: "S256",
                code_challenge: codeChallenge,
                redirect_uri: redirectUrl,
            };

            authUrl.search = new URLSearchParams(params).toString();
            window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
        });
    }

    // Soptify API Calls
    const getToken = useCallback(
        async (code) => {
            return fetch(tokenEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: redirectUrl,
                    code_verifier: code_verifier,
                }),
            }).then((resp) => resp.json());
        },
        [code_verifier],
    );

    async function refreshToken() {
        return fetch(tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            }),
        }).then((resp) => resp.json());
    }

    async function request(endpoint) {
        if (!access_token) return null;
        if (dayjs().isAfter(expires)) {
            console.log("refreshing spotify token");
            refreshToken().then((token) => {
                updateToken(token);
            });
        }
        return fetch(`https://api.spotify.com/v1/${endpoint}`, {
            method: "GET",
            headers: { Authorization: "Bearer " + access_token },
        }).then((resp) => {
            if (resp.status === 200) {
                return resp.json();
            } else {
                return null;
            }
        });
    }

    function logOut() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_in");
        localStorage.removeItem("expires");
    }

    // On page load, try to fetch auth code from current browser search URL
    useEffect(() => {
        const args = new URLSearchParams(window.location.search);
        const code = args.get("code");

        // If we find a code, we're in a callback, do a token exchange
        if (code) {
            getToken(code).then((token) => {
                if (token?.error) {
                    // console.error(token.error);
                    return;
                }
                updateToken(token);

                // Remove code from URL so we can refresh correctly.
                const url = new URL(window.location.href);
                url.searchParams.delete("code");

                const updatedUrl = url.search ? url.href : url.href.replace("?", "");
                window.history.replaceState({}, document.title, updatedUrl);
            });
        }
    }, [updateToken, getToken]);

    return {
        currentToken: {
            access_token,
            refresh_token,
            expires_in,
            expires,
        },
        redirectToSpotifyAuthorize,
        refreshToken,
        request,
        logOut,
    };
}
