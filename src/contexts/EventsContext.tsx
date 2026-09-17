import useWebhook from "@/hooks/useWebhook";
import type { EventsContextValue, WorkshopEvent } from "@/types";
import { dayjs } from "@/utils/time";
import { createContext, type ReactNode, useCallback, useMemo } from "react";

export const EventsContext = createContext<EventsContextValue | null>(null);

interface EventsProviderProps {
    children: ReactNode;
}

export function EventsProvider({ children }: EventsProviderProps) {
    const processData = useCallback((data: WorkshopEvent[]) => {
        // remove duplicates
        const unique = [...new Set(data.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));

        return [...unique].sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    }, []);

    const events = useWebhook<WorkshopEvent[]>("ticker/workshops", 3600000, processData);

    const safeEvents = useMemo(() => events ?? [], [events]);

    const eventsToday = useMemo(
        () => safeEvents.filter((event) => dayjs(event.Date).isSame(dayjs(), "day")),
        [safeEvents],
    );

    const activeEvent = useMemo(
        () =>
            eventsToday.find((event) => {
                const now = dayjs();
                return now.isAfter(dayjs(event.Date)) && now.isBefore(dayjs(event["End Date"]));
            }),
        [eventsToday],
    );

    return (
        <EventsContext.Provider value={{ events: safeEvents, eventsToday, activeEvent }}>
            {children}
        </EventsContext.Provider>
    );
}
