import { Flex, Grid } from "@radix-ui/themes";
import dayjs from "dayjs";
import useEvents from "../../hooks/useEvents";
import SpecialSlideTemplate from "./Template";

export default function Calendar({ callback }) {
    const { events } = useEvents();

    return (
        <SpecialSlideTemplate title="Upcoming Events & Workshops" callback={callback} timeout={20000}>
            <Flex direction="row" justify="start" align="center" gap="4" width="100%" height="100%">
                <Grid width="100%" gap="4" height="100%" columns="5" rows="auto">
                    {events.length > 0 &&
                        [...Array(21).keys()].map((dateOffset) => {
                            const day = dayjs()
                                .startOf("week")
                                .add(dateOffset + 1, "day")
                                .startOf("day");

                            // if it's a weekend skip
                            if (day.day() === 0 || day.day() === 6) return null;

                            const dayEvents = events?.filter((event) => day.isSame(dayjs(event["Date"]), "day")) || [];
                            const passed = day.isBefore(dayjs(), "day");

                            return (
                                <Flex
                                    direction="column"
                                    align="start"
                                    justify="start"
                                    gap="2"
                                    key={dateOffset}
                                    className={`${day.isSame(dayjs(), "day") && "border-4 border-amber-100"} bg-zinc-800 p-5 ${passed ? "opacity-50" : ""}`}
                                >
                                    <p className="text-xl font-medium text-[--gray-11]">{day.format("ddd, MMM D")}</p>

                                    {dayEvents.length > 0 ? (
                                        <>
                                            {dayEvents.map((event, index) => {
                                                return (
                                                    <Flex key={index} direction="column" gap="2">
                                                        <Flex direction="column" gap="1">
                                                            <p className="hyphens-auto text-3xl font-semibold">
                                                                {event["Name"]}
                                                            </p>
                                                            <p className="text-2xl font-medium text-[--gray-11]">
                                                                {dayjs(event["Date"]).format("h:mm A")}
                                                            </p>
                                                        </Flex>
                                                    </Flex>
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
                                </Flex>
                            );
                        })}
                </Grid>
                {/* <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    className="gap-24"
                    padding="5"
                    width="300px"
                    height="100%"
                >
                    <Flex direction="column" justify="center" align="center" width="100%" gap="4">
                        <p className="text-center text-3xl font-semibold">Sign up for our newsletter!</p>
                        <QRCode
                            value="newsletter.hivemakerspace.com"
                            bgColor="transparent"
                            fgColor="white"
                            size={200}
                            level="H"
                        />
                    </Flex>

                    <Flex direction="column" justify="center" align="center" width="100%" gap="4">
                        <p className="text-center text-3xl font-semibold">View the full workshop calendar</p>
                        <QRCode
                            value="https://airtable.com/appfNfbalzszBjjFp/shrfDyFGnrAlcGFFc"
                            bgColor="transparent"
                            fgColor="white"
                            size={200}
                            // level="H"
                        />
                    </Flex>
                </Flex> */}
            </Flex>
        </SpecialSlideTemplate>
    );
}
