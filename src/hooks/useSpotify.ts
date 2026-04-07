import { useContext } from "react";
import { SpotifyContext } from "@/contexts/SpotifyContext";
import type { SpotifyContextValue } from "@/types";

export default function useSpotify(): SpotifyContextValue {
    const ctx = useContext(SpotifyContext);
    if (!ctx) throw new Error("useSpotify must be used within SpotifyProvider");
    return ctx;
}
