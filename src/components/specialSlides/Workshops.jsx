import { Box, Flex, Separator } from "@radix-ui/themes";
import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { scroller } from "react-scroll";
import useEvents from "../../hooks/useEvents";
import SpecialSlideTemplate from "./Template";

export default function Workshops({ callback }) {
    const { events } = useEvents();
    const workshopCalendar = useMemo(() => {
        return events
            .filter((event) => {
                return dayjs(event["Publish Date"]).isBefore(dayjs());
            })
            .sort((a, b) => new Date(a["Date"]) - new Date(b["Date"]));
    }, [events]);

    const delay = 12500;

    useEffect(() => {
        if (workshopCalendar.length > 0) {
            const timer1 = setTimeout(() => {
                let index = 0;
                const scrollInterval = setInterval(() => {
                    index++;
                    if (index >= workshopCalendar.length) {
                        clearInterval(scrollInterval);
                        callback();
                        return;
                    }

                    scroller.scrollTo(`event-${index}`, {
                        duration: 750,
                        delay: 0,
                        smooth: "easeInOutQuart",
                        containerId: "container",
                    });
                }, delay);
                return () => {
                    clearInterval(scrollInterval);
                };
            }, delay);
            return () => {
                clearTimeout(timer1);
            };
        }
    }, [callback, workshopCalendar]);

    return (
        <SpecialSlideTemplate title="Workshop Spotlight">
            {workshopCalendar.length > 0 ? (
                <Box className="flex h-full w-full flex-col gap-8 overflow-auto" id="container">
                    {workshopCalendar.map((event, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Flex direction="row" justify="start" gap="7" p="5" height="100%" id={`event-${index}`}>
                                    <Flex direction="column" gap="5" justify="start" minWidth="250px">
                                        <Flex direction="column" gap="2" justify="start" align="start">
                                            <p className="text-5xl font-bold">
                                                {dayjs(event["Date"]).format("ddd MMM D")}
                                            </p>
                                            <p className="text-3xl text-[--gray-11]">
                                                {dayjs(event["Date"]).format("h:mm A")}
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
                                    <img src={event["Preview - Ticker"][0].url} className="h-full w-auto" />
                                </Flex>

                                {/* <div name="bottom" ref={mdRef} className="height-[0px]" /> */}
                            </React.Fragment>
                        );
                    })}
                </Box>
            ) : (
                <Flex justify="center" align="center" height="100%" width="100%">
                    <p className="text-4xl font-medium text-[--gray-11]">No events scheduled for this week</p>
                </Flex>
            )}
        </SpecialSlideTemplate>
    );
}
