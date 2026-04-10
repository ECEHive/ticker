import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export { dayjs };

export function formatTimeDigits(timeStr: string): string[] {
    return timeStr.split("");
}

export function formatHoursRange(open: dayjs.Dayjs, close: dayjs.Dayjs): string {
    const openStr = open.minute() === 0 ? open.format("ha") : open.format("h:mma");
    const closeStr = close.minute() === 0 ? close.format("ha") : close.format("h:mma");
    return `${openStr}-${closeStr}`;
}
