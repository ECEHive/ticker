import dayjs from "dayjs";
import { createContext } from "react";
import useWebhook from "../hooks/useWebhook";

const EventsContext = createContext();

function EventsProvider({ children }) {
    const events = useWebhook("ticker/workshops", 3600000, (data) => {
        console.log(data);
        return data.sort((a, b) => new Date(a["Date"]) - new Date(b["Date"]));
    });

    const eventsToday = events.filter((event) => {
        const eventDate = dayjs(event["Date"]);
        return eventDate.isSame(dayjs(), "day");
    });

    const activeEvent = eventsToday.find((event) => {
        const startTime = dayjs(event["Date"]);
        const endTime = dayjs(event["End Date"]);
        const now = dayjs();
        return now.isAfter(startTime) && now.isBefore(endTime);
    });

    return <EventsContext.Provider value={{ events, eventsToday, activeEvent }}>{children}</EventsContext.Provider>;
}
export { EventsContext, EventsProvider };
