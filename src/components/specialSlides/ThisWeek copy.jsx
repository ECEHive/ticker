import { Box, Flex, Separator } from "@radix-ui/themes";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef } from "react";
import QRCode from "react-qr-code";
import { animateScroll } from "react-scroll";
import useEvents from "../../hooks/useEvents";
import SpecialSlideTemplate from "./Template";

export default function ThisWeek({ callback }) {
    const { events } = useEvents();
    const workshopCalendar = useMemo(() => {
        return events
            .filter((event) => {
                return (
                    dayjs(event["Date"]).isAfter(dayjs().startOf("week")) &&
                    dayjs(event["Date"]).isBefore(dayjs().endOf("week"))
                );
            })
            .sort((a, b) => new Date(a["Date"]) - new Date(b["Date"]));
    }, [events]);

    const scrollSpeed = 20; //pixels per second
    const timePadding = 5000;
    const mdRef = useRef(null);
    const boxRef = useRef(null);

    useEffect(() => {
        if (workshopCalendar.length > 0) {
            const timer1 = setTimeout(() => {
                const rect = mdRef?.current?.getBoundingClientRect();
                const duration =
                    rect.y > boxRef.current.clientHeight
                        ? (rect.y - boxRef.current.clientHeight) / (scrollSpeed / 1000)
                        : 20000;

                animateScroll.scrollToBottom({
                    duration: duration,
                    delay: 0,
                    smooth: "linear",
                    spy: true,
                    containerId: "container",
                });

                const timer2 = setTimeout(() => {
                    callback();
                }, duration + timePadding);

                return () => {
                    clearTimeout(timer2);
                };
            }, timePadding);

            return () => {
                clearTimeout(timer1);
            };
        } else {
            const timer = setTimeout(() => {
                callback();
            }, 5000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [callback, workshopCalendar]);

    return (
        <SpecialSlideTemplate title="This week at The Hive">
            {workshopCalendar.length > 0 ? (
                <Box className="flex h-full w-full flex-col gap-8 overflow-auto" id="container" ref={boxRef}>
                    {workshopCalendar.map((event, index) => {
                        return (
                            <React.Fragment key={event["Name"]}>
                                <Flex
                                    key={event["Name"]}
                                    direction="row"
                                    justify="start"
                                    gap="9"
                                    width="100%"
                                    p="5"
                                    className={`${index % 2 === 0 ? "bg-zinc-800" : ""}`}
                                >
                                    <Flex direction="column" gap="4" justify="start" minWidth="200px">
                                        <p className="text-3xl font-bold">{dayjs(event["Date"]).format("ddd MMM D")}</p>
                                        <p className="text-2xl text-[--gray-11]">
                                            {dayjs(event["Date"]).format("h:mm A")}
                                        </p>
                                    </Flex>

                                    <Flex direction="column" gap="4" flexGrow="1">
                                        <p className="text-4xl font-semibold">{event["Name"]}</p>
                                        <p className="text-3xl font-normal">{event["Description"]}</p>
                                        <Separator size="2" />
                                        {event["Remaining Slots"] !== 0 ? (
                                            <span className="inline-flex text-3xl font-normal">
                                                <p className="font-medium">{event["Remaining Slots"]}&nbsp;</p>
                                                <p className="font-normal text-[--gray-11]">open seats</p>
                                            </span>
                                        ) : (
                                            <p className="text-3xl font-normal text-[--gray-11]">Full</p>
                                        )}
                                    </Flex>

                                    <Flex direction="column" justify="start" align="end" gap="2" width="375px">
                                        {event["Remaining Slots"] !== 0 ? (
                                            <>
                                                <QRCode
                                                    value={event["Signup URL"]}
                                                    className="p-2"
                                                    // get the current top level background color
                                                    // style={{ backgroundColor: "transparent" }}
                                                    fgColor="white"
                                                    bgColor="transparent"
                                                    level="L"
                                                />
                                            </>
                                        ) : (
                                            <>{/* <p className="text-3xl font-medium">Full</p> */}</>
                                        )}
                                    </Flex>
                                </Flex>

                                <div name="bottom" ref={mdRef} />
                                {/* {index + 1 < workshopCalendar.length && <Separator size="4" />} */}
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
