import useTime from "@/hooks/useTime";
import type { OpenState } from "@/types";
import { formatHoursRange } from "@/utils/time";
import { Box, Flex, Text } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

const DIGIT_MAP = [
    (t: string) => (t[0] !== "0" ? t[0] : ""),
    (t: string) => t[1],
    () => ":",
    (t: string) => t[3],
    (t: string) => t[4],
];

function HoursDisplay({
    timeHelper,
    openState,
}: {
    timeHelper: [string, string, unknown, unknown];
    openState: OpenState;
}) {
    const isHoursMode = timeHelper[0] === "hours";
    const showMono = timeHelper[0] !== "Closing" && openState.openNow;

    return (
        <Flex direction="column" align="start" justify="end" gap="2" height="100%">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    key={timeHelper[1]}
                >
                    <p className="text-5xl font-medium text-[--gray-11]">{timeHelper[1]}</p>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    key={timeHelper[0]}
                >
                    <p className={`${showMono ? "font-mono" : "font-sans"} text-7xl font-semibold leading-none`}>
                        {isHoursMode && openState.hours
                            ? formatHoursRange(openState.hours[0], openState.hours[1])
                            : timeHelper[0]}
                    </p>
                </motion.div>
            </AnimatePresence>
        </Flex>
    );
}

export default function SpaceInfo() {
    const { time, openState, date, timeHelper } = useTime();

    const dateLines = useMemo(() => date.split(" "), [date]);

    return (
        <Box width="auto" height="100%" minHeight="100%" maxWidth="650px" maxHeight="100%">
            <Flex direction="column" justify="start" align="center" gap="8" minHeight="100%" width="100%">
                {/* Clock */}
                <Flex direction="column" justify="start" align="start" gap="1" height="auto" width="100%" pt="7" px="7">
                    <Flex direction="row" align="start" justify="center" gap="0" height="auto" width="auto">
                        {DIGIT_MAP.map((getDigit, index) => (
                            <AnimatePresence mode="popLayout" key={index}>
                                <motion.div
                                    key={getDigit(time[0])}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <p
                                        className={`${
                                            getDigit(time[0]) !== ":"
                                                ? "font-mono text-[9.8rem] font-semibold"
                                                : "font-sans text-[9.8rem] font-medium"
                                        } leading-none`}
                                    >
                                        {getDigit(time[0])}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        ))}
                        <Text className="mb-4 self-end font-mono text-5xl font-medium">{time[1]}</Text>
                    </Flex>

                    <Flex direction="column" align="start" justify="start" gap="0" height="auto" width="100%">
                        <Text className="text-6xl font-medium text-[--gray-11]">{dateLines[0]}</Text>
                        <Text className="text-6xl font-medium text-[--gray-11]">
                            {dateLines[1]} {dateLines[2]}
                        </Text>
                    </Flex>
                </Flex>

                {/* Hours status */}
                <Flex
                    direction="column"
                    align="start"
                    justify="end"
                    gap="0"
                    height="100%"
                    width="100%"
                    pb="7"
                    px="7"
                    className="flex flex-grow"
                >
                    {timeHelper && <HoursDisplay timeHelper={timeHelper} openState={openState} />}
                </Flex>
            </Flex>
        </Box>
    );
}
