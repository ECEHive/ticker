import { Flex, Grid } from "@radix-ui/themes";
import dayjs from "dayjs";
import { motion } from "motion/react";
import useEvents from "../../hooks/useEvents";
import SpecialSlideTemplate from "./Template";

export default function Workshops({ callback }) {
    const { events } = useEvents();

    return (
        <SpecialSlideTemplate title="Upcoming Events & Workshops" callback={callback} timeout={20000}>
            <Grid width="100%" gap="4" height="100%" columns="5" rows="auto">
                {events.length > 0 &&
                    [...Array(14).keys()].map((dateOffset) => {
                        const day = dayjs()
                            .startOf("week")
                            .add(dateOffset + 1, "day")
                            .startOf("day");

                        // if it's a weekend skip
                        if (day.day() === 0 || day.day() === 6) return null;

                        const dayEvents = events?.filter((event) => day.isSame(dayjs(event["Date"]), "day")) || [];
                        const passed = day.isBefore(dayjs(), "day");

                        return (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: passed ? 0.5 : 1 }}
                                transition={{ delay: dateOffset * 0.01 }}
                                key={dateOffset}
                                className={`flex flex-col items-start justify-start gap-2 ${day.isSame(dayjs(), "day") && "border-4 border-amber-100"} bg-zinc-800 p-5`}
                            >
                                <p className="text-xl font-medium text-[--gray-11]">{day.format("ddd, MMM D")}</p>

                                {dayEvents.length > 0 ? (
                                    <>
                                        {dayEvents.map((event, index) => {
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className={`flex flex-col gap-2`}
                                                >
                                                    <Flex direction="column" gap="1">
                                                        <p className="text-4xl font-semibold">{event["Name"]}</p>
                                                        <p className="text-2xl font-medium">
                                                            {dayjs(event["Date"]).format("h:mm A")}
                                                        </p>
                                                    </Flex>

                                                    <Flex direction="column" gap="1">
                                                        {event["Remaining Slots"] !== 0 ? (
                                                            <span className="inline-flex text-3xl">
                                                                <span className="font-mono font-medium">
                                                                    {event["Remaining Slots"]}
                                                                </span>
                                                                <span className="text-[--gray-11]">
                                                                    &nbsp;open seats
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex text-3xl">
                                                                <span className="font-mono font-medium">
                                                                    {event["# Waitlist"]}
                                                                </span>
                                                                <span className="text-[--gray-11]">
                                                                    &nbsp;on waitlist
                                                                </span>
                                                            </span>
                                                        )}
                                                    </Flex>
                                                </motion.div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <Flex
                                        direction="column"
                                        justify="center"
                                        flexGrow="1"
                                        className="h-full grow self-center"
                                    >
                                        {/* <p className="text-3xl font-medium text-[--gray-8]">No events</p> */}
                                    </Flex>
                                )}
                            </motion.div>
                        );
                    })}
            </Grid>
            <Flex className="mt-6 flex flex-row items-center justify-start gap-4">
                <p className="text-3xl font-medium">
                    Event signups are sent in our weekly newsletter! Subscribe at{" "}
                    <a className="underline">newsletter.hivemakerspace.com</a>
                </p>
                {/* <img src={newsletterQR} className="h-16" /> */}
            </Flex>
        </SpecialSlideTemplate>
    );
}
