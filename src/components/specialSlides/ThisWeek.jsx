import { Flex, Separator } from "@radix-ui/themes";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import QRCode from "react-qr-code";
import useEvents from "../../hooks/useEvents";
import SpecialSlideTemplate from "./Template";

export default function ThisWeek({ callback }) {
    const { events } = useEvents();
    const workshopCalendar = useMemo(() => {
        return events
            .filter((event) => {
                return (
                    dayjs(event["Date"]).isAfter(dayjs().startOf("week").add(2, "week")) &&
                    dayjs(event["Date"]).isBefore(dayjs().endOf("week").add(2, "week"))
                );
            })
            .sort((a, b) => new Date(a["Date"]) - new Date(b["Date"]));
    }, [events]);

    return (
        <SpecialSlideTemplate title="This week at The Hive" callback={callback} timeout={20000}>
            <Flex direction="column" gap="6" width="100%" overflow="auto">
                {workshopCalendar.length > 0 ? (
                    workshopCalendar.map((event, index) => {
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
                                        <p className="text-3xl font-medium">
                                            {dayjs(event["Date"]).format("ddd MMM D")}
                                        </p>
                                        <p className="text-3xl text-[--gray-11]">
                                            {dayjs(event["Date"]).format("h:mm A")}
                                        </p>
                                    </Flex>

                                    <Flex direction="column" gap="4">
                                        <p className="text-4xl font-semibold">{event["Name"]}</p>
                                        <p className="text-3xl font-normal">{event["Description"]}</p>
                                        <Separator size="2" />
                                        {event["Remaining Slots"] !== 0 ? (
                                            <p className="text-3xl font-normal text-[--gray-11]">
                                                {event["Remaining Slots"]} open seats
                                            </p>
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
                                            <>
                                                <p className="text-3xl font-medium">Full</p>
                                            </>
                                        )}
                                    </Flex>
                                </Flex>
                                <Separator size="4" />
                            </React.Fragment>
                        );
                    })
                ) : (
                    <p className="text-2xl font-medium text-[--gray-11]">No events scheduled for this week.</p>
                )}
            </Flex>
        </SpecialSlideTemplate>
    );
}
