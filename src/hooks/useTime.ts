import { useContext } from "react";
import { TimeContext } from "@/contexts/TimeContext";
import type { TimeContextValue } from "@/types";

export default function useTime(): TimeContextValue {
    const ctx = useContext(TimeContext);
    if (!ctx) throw new Error("useTime must be used within TimeProvider");
    return ctx;
}
