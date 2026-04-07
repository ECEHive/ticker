import { fetchOpenHours } from "@/api/hums";
import type {
    AlertContent,
    AlertType,
    HoursState,
    OpenState,
    ScheduledAlert,
    TimeContextValue,
    TimeHelperTuple,
} from "@/types";
import { playAudio } from "@/utils/audio";
import { dayjs } from "@/utils/time";
import { ClockIcon, ExitIcon, IdCardIcon, SunIcon, TrashIcon } from "@radix-ui/react-icons";
import { createContext, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import chime2Sound from "@/assets/audio/chime_2.mp3";
import chime3Sound from "@/assets/audio/chime_3.mp3";

export const TimeContext = createContext<TimeContextValue | null>(null);

interface TimeProviderProps {
    children: ReactNode;
}

const ALERT_TEMPLATES: Record<AlertType, (time: dayjs.Dayjs) => AlertContent> = {
    hourly: (time) => ({
        title: `The time is ${time.format("hA")}`,
        icon: ClockIcon,
        bullets: [{ icon: TrashIcon, text: "Help keep the space clean!" }],
    }),
    opened: () => ({
        title: "The Hive is now open",
        icon: SunIcon,
        text: "Good morning and welcome to the Hive!",
    }),
    closingSoon: () => ({
        title: "The Hive is closing soon",
        icon: ClockIcon,
        bullets: [
            { icon: TrashIcon, text: "Start cleaning your work area" },
            { icon: IdCardIcon, text: "Remember to sign out of SUMS when leaving" },
        ],
    }),
    openingSoon: () => ({
        title: "The Hive is opening soon",
        icon: SunIcon,
        bullets: [{ icon: IdCardIcon, text: "Remember to sign in for your shift" }],
    }),
    closed: () => ({
        title: "The Hive is now closed",
        icon: ExitIcon,
        bullets: [
            { icon: TrashIcon, text: "Clean your work area" },
            { icon: IdCardIcon, text: "Sign out of SUMS when leaving" },
        ],
    }),
};

const DEFAULT_OPEN_STATE: OpenState = { openNow: false, openToday: false };
const DEFAULT_TIME_HELPER: TimeHelperTuple = ["Closed", "Today", "", ""];

export function TimeProvider({ children }: TimeProviderProps) {
    const [timeRaw, setTimeRaw] = useState(() => dayjs().subtract(1, "minute"));
    const [time, setTime] = useState<[string, string]>(["12:00", "AM"]);
    const [date, setDate] = useState("Sun Sep 29");

    const alertBlock = useRef(false);
    const recentAlertId = useRef("");
    const [alertActive, setAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState<AlertContent | null>(null);

    const [hours, setHours] = useState<HoursState>({ openToday: false, hours: [] });

    // Fetch open hours on mount
    useEffect(() => {
        fetchOpenHours().then((response) => {
            if (!response?.data?.periods) return;

            const period = response.data.periods.find((p) => {
                const start = dayjs.utc(p.periodStart);
                const end = dayjs.utc(p.periodEnd);
                return dayjs().isBetween(start, end, null, "[]");
            });

            if (!period) return;

            const today = period.schedule.find((day) => day.dayOfWeek === dayjs().day());
            if (!today?.ranges?.[0]) return;

            const hasException = period.exceptions.some((ex) => {
                const start = dayjs.utc(ex.start);
                const end = dayjs.utc(ex.end);
                return dayjs().isBetween(start, end, null, "[]");
            });

            if (hasException) {
                setHours({ openToday: false, hours: [] });
            } else {
                setHours({
                    openToday: true,
                    hours: [today.ranges[0].start, today.ranges[0].end],
                });
            }
        });
    }, []);

    // Compute open state from hours + current time
    const openState = useMemo<OpenState>(() => {
        if (!hours.openToday || hours.hours.length === 0) return DEFAULT_OPEN_STATE;

        const [openStr, closeStr] = hours.hours as [string, string];
        const openTime = timeRaw
            .set("hour", parseInt(openStr.split(":")[0]))
            .set("minute", parseInt(openStr.split(":")[1]))
            .set("second", 0);
        const closeTime = timeRaw
            .set("hour", parseInt(closeStr.split(":")[0]))
            .set("minute", parseInt(closeStr.split(":")[1]))
            .set("second", 0);

        return {
            openNow: timeRaw.isBetween(openTime, closeTime, null, "[)"),
            openToday: true,
            hours: [openTime, closeTime],
        };
    }, [hours, timeRaw]);

    // Update time every second (only triggers re-render on minute change)
    useEffect(() => {
        const interval = setInterval(() => {
            if (timeRaw.format("m") === dayjs().format("m")) return;
            setTime([dayjs().format("hh:mm"), dayjs().format("A")]);
            setDate(dayjs().format("dddd MMMM D"));
            setTimeRaw(dayjs());
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRaw]);

    // Time helper for display
    const timeHelper = useMemo<TimeHelperTuple>(() => {
        if (!openState.openToday || !openState.hours) return DEFAULT_TIME_HELPER;

        const [openTime, closeTime] = openState.hours;
        const timeUntilClose = dayjs.duration(closeTime.diff(dayjs(), "milliseconds"));
        const timeUntilOpen = dayjs.duration(openTime.diff(dayjs(), "milliseconds"));

        if (timeUntilOpen.asMinutes() < 60 && timeUntilOpen.asMinutes() > 0) {
            return ["Opening", `at ${openTime.format("ha")}`, openTime, closeTime];
        } else if (timeUntilClose.asMinutes() < 60 && timeUntilClose.asMinutes() > 0) {
            return ["hours", "Closing soon", openTime, closeTime];
        } else if (!openState.openNow) {
            if (dayjs().hour() >= closeTime.hour() && dayjs().minute() >= closeTime.minute()) {
                return ["Closed", "After hours", openTime, closeTime];
            }
            return ["Closed", "Before hours", openTime, closeTime];
        }
        return ["hours", "Today's hours", openTime, closeTime];
    }, [openState]);

    // Build alert schedule
    const alertSchedule = useMemo<ScheduledAlert[]>(() => {
        if (!openState.openToday || !openState.hours) return [];

        const [openTime, closeTime] = openState.hours;
        return [
            {
                start: closeTime.subtract(15, "minute"),
                end: closeTime,
                type: "closingSoon" as const,
                chime: chime3Sound,
                id: "closingSoon",
            },
            {
                start: closeTime,
                end: closeTime.add(10, "minute"),
                type: "closed" as const,
                chime: chime3Sound,
                id: "closed",
            },
            {
                start: openTime.subtract(5, "minute"),
                end: openTime,
                type: "openingSoon" as const,
                chime: chime3Sound,
                id: "openingSoon",
            },
            {
                start: openTime,
                end: openTime.add(10, "minute"),
                type: "opened" as const,
                chime: chime3Sound,
                id: "opened",
            },
        ];
    }, [openState]);

    // Trigger alerts
    useEffect(() => {
        let currentAlert: ScheduledAlert | undefined = alertSchedule.find((alert) =>
            timeRaw.isBetween(alert.start, alert.end, "minute", "[)"),
        );

        if (timeRaw.minute() === 0 && openState.openNow) {
            currentAlert = {
                start: timeRaw,
                end: timeRaw.add(1, "minute"),
                type: "hourly",
                chime: chime2Sound,
                id: timeRaw.format("hh:mm"),
            };
        }

        if (currentAlert && currentAlert.id !== recentAlertId.current) {
            setAlertContent(ALERT_TEMPLATES[currentAlert.type](timeRaw));

            if (!alertBlock.current || recentAlertId.current !== currentAlert.id) {
                recentAlertId.current = currentAlert.id;
                alertBlock.current = true;
                setAlertActive(true);
                playAudio(currentAlert.chime);
            }
        } else if (alertBlock.current && !currentAlert) {
            setAlertContent(null);
            setAlertActive(false);
            alertBlock.current = false;
        }
    }, [timeRaw, openState, alertSchedule]);

    return (
        <TimeContext.Provider value={{ time, date, openState, hours, alertActive, alertContent, timeHelper }}>
            {children}
        </TimeContext.Provider>
    );
}
