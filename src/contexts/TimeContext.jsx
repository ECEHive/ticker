import { ClockIcon, ExitIcon, IdCardIcon, SunIcon, TrashIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import PropTypes from "prop-types";
import { createContext, useEffect, useMemo, useRef, useState } from "react";

// audio imports
import chime2Sound from "../assets/audio/chime_2.mp3";
import chime3Sound from "../assets/audio/chime_3.mp3";

const TimeContext = createContext();
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

function TimeProvider({ children }) {
    const [timeRaw, setTimeRaw] = useState(dayjs().subtract(1, "minute"));
    const [time, setTime] = useState(["12:00", "AM"]);
    const [date, setDate] = useState("Sun Sep 29");

    const alertBlock = useRef(false);
    const recentAlertId = useRef("");
    const [alertActive, setAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState(null);

    const [hours, setHours] = useState({
        openToday: false,
        hours: [],
    });

    useEffect(() => {
        fetch("https://hums.hivemakerspace.com/api/rest/open-hours")
            .then((res) => res.json())
            .then((response) => {
                const data = response.data;

                // find currently active period
                const period = data.periods.find((period) => {
                    const start = dayjs.utc(period.periodStart);
                    const end = dayjs.utc(period.periodEnd);
                    return dayjs().isBetween(start, end, null, "[]");
                });

                // find today's hours
                const today = period.schedule.find((day) => day.dayOfWeek === dayjs().day());
                if (today) {
                    // check if there's an exception covering today
                    if (
                        period.exceptions.find((exception) => {
                            const start = dayjs.utc(exception.exceptionStart);
                            const end = dayjs.utc(exception.exceptionEnd);
                            return dayjs().isBetween(start, end, null, "[]");
                        })
                    ) {
                        setHours({
                            openToday: false,
                            hours: [],
                        });
                    } else {
                        setHours({
                            openToday: true,
                            hours: [today.ranges[0].start, today.ranges[0].end],
                        });
                    }
                }
            });
    }, []);

    const openState = useMemo(() => {
        if (hours.openToday) {
            const openTime = timeRaw
                .set("hour", hours.hours[0].split(":")[0])
                .set("minute", hours.hours[0].split(":")[1]);
            const closeTime = timeRaw
                .set("hour", hours.hours[1].split(":")[0])
                .set("minute", hours.hours[1].split(":")[1]);

            if (timeRaw.isBetween(openTime, closeTime, null, "[)")) {
                return {
                    openNow: true,
                    openToday: true,
                    hours: [openTime, closeTime],
                };
            } else {
                return {
                    openNow: false,
                    openToday: true,
                    hours: [openTime, closeTime],
                };
            }
        } else {
            return {
                openNow: false,
                openToday: false,
            };
        }
    }, [hours, timeRaw]);

    useEffect(() => {
        const secondInterval = setInterval(() => {
            if (timeRaw.format("m") === dayjs().format("m")) return;
            setTime([dayjs().format("hh:mm"), dayjs().format("A")]);
            setDate(dayjs().format("dddd MMMM D"));
            setTimeRaw(dayjs());
        }, 1000);

        return () => {
            clearInterval(secondInterval);
        };
    }, [timeRaw]);

    const timeHelper = useMemo(() => {
        if (!openState?.openToday) return ["Closed", "Today", "", ""];

        const openTime = openState.hours[0];
        const closeTime = openState.hours[1];

        const timeUntilClose = dayjs.duration(closeTime.diff(dayjs(), "milliseconds"));
        const timeUntilOpen = dayjs.duration(openTime.diff(dayjs(), "milliseconds"));

        if (timeUntilOpen.asMinutes() < 60 && timeUntilOpen.asMinutes() > 0) {
            return ["Opening", `at ${openTime.format("ha")}`, openTime, closeTime];
        } else if (timeUntilClose.asMinutes() < 60 && timeUntilClose.asMinutes() > 0) {
            return ["hours", "Closing soon", openTime, closeTime];
        } else if (!openState.openNow) {
            if (dayjs().hour() >= closeTime.hour() && dayjs().minute() >= closeTime.minute()) {
                return ["Closed", "After hours", openTime, closeTime];
            } else {
                return ["Closed", "Before hours", openTime, closeTime];
            }
        } else {
            return ["hours", "Today's hours", openTime, closeTime];
        }
    }, [openState]);

    // ALERT STUFF --------------------------------------------------------
    const alertTemplates = useMemo(
        () => ({
            hourly: (time) => {
                return {
                    title: `The time is ${time.format("hA")}`,
                    icon: ClockIcon,
                    bullets: [
                        {
                            icon: TrashIcon,
                            text: "Help keep the space clean!",
                        },
                        // {
                        //     icon: PersonIcon,
                        //     text: "This is a community run space, be respectful of it",
                        // },
                    ],
                };
            },
            opened: (timeRaw) => {
                return {
                    title: `The Hive is now open`,
                    icon: SunIcon,
                    text: "Good morning and welcome to the Hive!",
                };
            },
            closingSoon: (timeRaw) => {
                return {
                    title: `The Hive is closing soon`,
                    icon: ClockIcon,
                    bullets: [
                        {
                            icon: TrashIcon,
                            text: "Start cleaning your work area",
                        },
                        {
                            icon: IdCardIcon,
                            text: "Remember to sign out of SUMS when leaving",
                        },
                    ],
                };
            },
            openingSoon: (timeRaw) => {
                return {
                    title: `The Hive is opening soon`,
                    icon: SunIcon,
                    bullets: [
                        {
                            icon: IdCardIcon,
                            text: "Remember to sign in for your shift",
                        },
                    ],
                };
            },
            closed: (timeRaw) => {
                return {
                    title: `The Hive is now closed`,
                    icon: ExitIcon,
                    bullets: [
                        {
                            icon: TrashIcon,
                            text: "Clean your work area",
                        },
                        {
                            icon: IdCardIcon,
                            text: "Sign out of SUMS when leaving",
                        },
                    ],
                };
            },
        }),
        [],
    );

    const alertSchedule = useMemo(() => {
        if (openState.openToday) {
            const openTime = openState.hours[0];
            const closeTime = openState.hours[1];

            const data = [
                {
                    start: closeTime.subtract(15, "minute"),
                    end: closeTime,
                    type: "closingSoon",
                    chime: chime3Sound,
                    id: "closingSoon",
                },
                {
                    start: closeTime,
                    end: closeTime.add(10, "minute"),
                    type: "closed",
                    chime: chime3Sound,
                    id: "closed",
                },
                {
                    start: openTime.subtract(5, "minute"),
                    end: openTime,
                    type: "openingSoon",
                    chime: chime3Sound,
                    id: "openingSoon",
                },
                {
                    start: openTime,
                    end: openTime.add(10, "minute"),
                    type: "opened",
                    chime: chime3Sound,
                    id: "opened",
                },
            ];
            return data;
        }
        return [];
    }, [openState]);

    useEffect(() => {
        // hourly alerts
        let currentAlert = alertSchedule.find((alert) => {
            return timeRaw.isBetween(alert.start, alert.end, "minute", "[)");
        });
        if (timeRaw.minute() === 0 && openState.openNow) {
            // hourly alert
            currentAlert = {
                start: timeRaw,
                end: timeRaw.add(1, "minute"),
                type: "hourly",
                chime: chime2Sound,
                id: `${timeRaw.format("hh:mm")}`,
            };
        }

        // play alert
        if (currentAlert && currentAlert.id !== recentAlertId.current) {
            setAlertContent(alertTemplates[currentAlert.type](timeRaw));

            if (!alertBlock.current || recentAlertId.current !== currentAlert.id) {
                recentAlertId.current = currentAlert.id;
                console.log("alerting");
                // make announcement
                alertBlock.current = true;
                setAlertActive(true);

                // play chime sound and wait for it to finish before continuing
                const audio = new Audio(currentAlert.chime);
                audio.play();
                audio.onended = () => {
                    // play stevie audio
                };
            }
        } else if (alertBlock.current && !currentAlert) {
            console.log("alert done");
            setAlertContent(null);
            setAlertActive(false);
            alertBlock.current = false;
        }
    }, [timeRaw, openState, alertSchedule, alertTemplates]);

    return (
        <TimeContext.Provider value={{ time, date, openState, hours, alertActive, alertContent, timeHelper }}>
            {children}
        </TimeContext.Provider>
    );
}

TimeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { TimeContext, TimeProvider };
