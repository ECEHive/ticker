import { useContext } from "react";
import { EventsContext } from "@/contexts/EventsContext";
import type { EventsContextValue } from "@/types";

export default function useEvents(): EventsContextValue {
    const ctx = useContext(EventsContext);
    if (!ctx) throw new Error("useEvents must be used within EventsProvider");
    return ctx;
}
