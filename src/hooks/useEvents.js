import { useContext } from "react";
import { EventsContext } from "@/contexts/EventsContext";

export default function useEvents() {
    const ctx = useContext(EventsContext);
    if (!ctx) throw new Error("useEvents must be used within EventsProvider");
    return ctx;
}
