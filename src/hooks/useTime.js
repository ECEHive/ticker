import { useContext } from "react";
import { TimeContext } from "@/contexts/TimeContext";

export default function useTime() {
    const ctx = useContext(TimeContext);
    if (!ctx) throw new Error("useTime must be used within TimeProvider");
    return ctx;
}
