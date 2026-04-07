import ErrorBoundary from "@/components/ErrorBoundary";
import Calendar from "@/components/frontdesk/Calendar";
import Hero from "@/components/frontdesk/Hero";
import Printers from "@/components/frontdesk/Printers";
import QRCodes from "@/components/frontdesk/QRCodes";
import Workshops from "@/components/frontdesk/Workshops";
import useTime from "@/hooks/useTime";
import type { FrontDeskSlide } from "@/types";
import { Flex } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import { cloneElement, isValidElement, useCallback, useMemo, useState } from "react";

const ALL_SLIDES: FrontDeskSlide[] = [
    { component: <Hero key="hero" />, skipIfClosed: false },
    { component: <Printers key="printers" />, skipIfClosed: false },
    { component: <Calendar key="calendar" />, skipIfClosed: false },
    { component: <Workshops key="workshops" />, skipIfClosed: false },
    { component: <QRCodes key="qrcodes" />, skipIfClosed: false },
];

export default function FrontDesk() {
    const { openState } = useTime();

    const slides = useMemo(() => {
        return ALL_SLIDES.filter((slide) => {
            if (slide.skip) return false;
            if (slide.skipIfClosed && !openState.openNow) return false;
            return true;
        });
    }, [openState]);

    const [slideIndex, setSlideIndex] = useState(0);

    const incrementSlide = useCallback(() => {
        setSlideIndex((prev) => (prev + 1 >= slides.length ? 0 : prev + 1));
    }, [slides]);

    const currentSlide = slides[slideIndex]?.component;

    return (
        <Flex
            direction="column"
            height="100%"
            minHeight="100%"
            width="100%"
            minWidth="100%"
            position="relative"
            justify="start"
            align="start"
            p="7"
            gap="6"
            onClick={incrementSlide}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={slideIndex}
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full max-h-full w-full max-w-full"
                >
                    <ErrorBoundary>
                        {isValidElement(currentSlide)
                            ? cloneElement(currentSlide as React.ReactElement<{ callback?: () => void }>, {
                                  callback: incrementSlide,
                              })
                            : null}
                    </ErrorBoundary>
                </motion.div>
            </AnimatePresence>
        </Flex>
    );
}
