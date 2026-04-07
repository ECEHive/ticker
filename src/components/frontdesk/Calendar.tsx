import useEvents from "@/hooks/useEvents";
import { dayjs } from "@/utils/time";
import { Flex, Grid } from "@radix-ui/themes";
import SlideTemplate from "./SlideTemplate";

interface CalendarProps {
    callback?: () => void;
}

const CALENDAR_DAYS = 21;

export default function Calendar({ callback }: CalendarProps) {
    const { events } = useEvents();

    return (
        <SlideTemplate title="Upcoming Events & Workshops" callback={callback} timeout={20000}>
            <Flex direction="row" justify="start" align="center" gap="4" width="100%" height="100%">
                <Grid width="100%" gap="4" height="100%" columns="5" rows="auto">
                    {events.length > 0 &&
                        [...Array(CALENDAR_DAYS).keys()].map((dateOffset) => {
                            const day = dayjs()
                                .startOf("week")
                                .add(dateOffset + 1, "day")
                                .startOf("day");

                            // Skip weekends
                            if (day.day() === 0 || day.day() === 6) return null;

                            const dayEvents = events.filter((event) => day.isSame(dayjs(event.Date), "day"));
                            const isToday = day.isSame(dayjs(), "day");
                            const isPast = day.isBefore(dayjs(), "day");

                            return (
                                <Flex
                                    direction="column"
                                    align="start"
                                    justify="start"
                                    gap="2"
                                    key={dateOffset}
                                    className={`${isToday ? "border-4 border-amber-100" : ""} bg-zinc-800 p-5 ${isPast ? "opacity-50" : ""}`}
                                >
                                    <p className="text-xl font-medium text-[--gray-11]">{day.format("ddd, MMM D")}</p>

                                    {dayEvents.map((event, index) => (
                                        <Flex key={index} direction="column" gap="2">
                                            <Flex direction="column" gap="1">
                                                <p className="hyphens-auto text-3xl font-semibold">{event.Name}</p>
                                                <p className="text-2xl font-medium text-[--gray-11]">
                                                    {dayjs(event.Date).format("h:mm A")}
                                                </p>
                                            </Flex>
                                        </Flex>
                                    ))}
                                </Flex>
                            );
                        })}
                </Grid>
            </Flex>
        </SlideTemplate>
    );
}
