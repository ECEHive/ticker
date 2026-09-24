import { useContext } from "react";
import { SpotifyContext } from "@/contexts/SpotifyContext";

export default function useSpotify() {
    const ctx = useContext(SpotifyContext);
    if (!ctx) throw new Error("useSpotify must be used within SpotifyProvider");
    return ctx;
}
