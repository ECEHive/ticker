import useEvents from "@/hooks/useEvents";
import { dayjs } from "@/utils/time";
import { Box, Flex, Separator } from "@radix-ui/themes";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { scroller } from "react-scroll";
import SlideTemplate from "./SlideTemplate";

interface WorkshopsProps {
    callback?: () => void;
}

const SCROLL_DELAY = 10000;

export default function Workshops({ callback }: WorkshopsProps) {
    const { events } = useEvents();
    const index = useRef(1);

    const workshopCalendar = useMemo(
        () =>
            events
                .filter((event) => {
                    if (!event["Publish Date"]) return false;
                    return dayjs(event["Publish Date"]).isBefore(dayjs());
                })
                .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()),
        [events],
    );

    useEffect(() => {
        if (workshopCalendar.length === 0) return;
        index.current = 1;

        const scrollInterval = setInterval(() => {
            if (index.current >= workshopCalendar.length) {
                clearInterval(scrollInterval);
                callback?.();
                return;
            }

            scroller.scrollTo(`event-${index.current}`, {
                duration: 750,
                delay: 0,
                smooth: "easeInOutQuart",
                containerId: "container",
            });
            index.current++;
        }, SCROLL_DELAY);

        return () => clearInterval(scrollInterval);
    }, [callback, workshopCalendar]);

    return (
        <SlideTemplate title="Workshop Spotlight">
            {workshopCalendar.length > 0 ? (
                <Box className="flex h-full w-full flex-col gap-8 overflow-auto" id="container">
                    {workshopCalendar.map((event, i) => {
                        const previewUrl = event["Preview - Ticker"]?.[0]?.url;
                        return (
                            <Fragment key={i}>
                                <Flex direction="row" justify="start" gap="7" p="5" height="100%" id={`event-${i}`}>
                                    <Flex direction="column" gap="5" justify="start" minWidth="250px">
                                        <Flex direction="column" gap="2" justify="start" align="start">
                                            <p className="text-5xl font-bold">
                                                {dayjs(event.Date).format("ddd MMM D")}
                                            </p>
                                            <p className="text-3xl text-[--gray-11]">
                                                {dayjs(event.Date).format("h:mm A")}
                                            </p>
                                        </Flex>
                                        <Separator orientation="horizontal" size="3" />
                                        <Flex direction="column" justify="start" align="start" gap="2">
                                            {event["Remaining Slots"] > 0 ? (
                                                <p className="flex-grow text-4xl">
                                                    {event["Remaining Slots"]} seats available
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="flex-grow text-4xl font-bold">Full</p>
                                                    <p className="flex-grow text-4xl text-[--gray-11]">
                                                        {event["# Waitlist"]} waitlisted
                                                    </p>
                                                </>
                                            )}
                                        </Flex>
                                    </Flex>
                                    {previewUrl && <img src={previewUrl} className="h-full w-auto" alt={event.Name} />}
                                </Flex>
                            </Fragment>
                        );
                    })}
                </Box>
            ) : (
                <Flex justify="center" align="center" height="100%" width="100%">
                    <p className="text-4xl font-medium text-[--gray-11]">No upcoming workshops</p>
                </Flex>
            )}
        </SlideTemplate>
    );
}
