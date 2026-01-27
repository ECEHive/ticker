import { useContext } from "react";
import { EventsContext } from "../contexts/EventsContext";

export default function useEvents() {
    return useContext(EventsContext);
}
