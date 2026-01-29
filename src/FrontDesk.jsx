import { Flex } from "@radix-ui/themes";
import Hero from "./components/specialSlides/Hero";
// import Workshops from "./components/specialSlides/Workshops";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useMemo, useState } from "react";
import Calendar from "./components/specialSlides/Calendar";
import Printers from "./components/specialSlides/Printers";
import QRCodes from "./components/specialSlides/QRCodes";
import useTime from "./hooks/useTime";

export default function FrontDesk({}) {
    const { openState } = useTime();

    const slidesAll = useMemo(
        () => [
            {
                component: <Hero key="hero" />,
                skipIfClosed: false,
            },
            {
                component: <Printers key="printers" />,
                skipIfClosed: false,
            },
            {
                component: <Calendar key="calendar" />,
                skipIfClosed: false,
            },
            {
                component: <QRCodes key="qrcodes" />,
                skipIfClosed: false,
            },
            // {
            //     component: <ThisWeek key="thisweek" />,
            //     skipIfClosed: false,
            // },
        ],
        [],
    );

    const slides = useMemo(() => {
        const open = openState.openNow;
        return slidesAll.filter((slide) => {
            if (slide.skip) return false;
            if (slide.skipIfClosed && !open) return false;
            return true;
        });
    }, [slidesAll, openState]);

    const [slideIndex, setSlideIndex] = useState(0);

    const incrementSlide = useCallback(() => {
        // currentSlideIndex.current += 1;
        setSlideIndex((prevIndex) => {
            if (prevIndex + 1 >= slides.length) {
                return 0;
            } else {
                return prevIndex + 1;
            }
        });
    }, [slides]);

    return (
        <>
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
                onClick={() => {
                    // advance to next slide
                    incrementSlide();
                }}
            >
                {/* {alertActive ? (
                    <>
                        <Alert />
                    </>
                ) : ( */}
                <AnimatePresence mode="wait">
                    <motion.div
                        // fade the div when currentSlide changes
                        key={slideIndex || "empty"}
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full max-h-full w-full max-w-full"
                    >
                        {/* add an index prop to currentSlide */}
                        {React.cloneElement(slides[slideIndex].component, {
                            callback: incrementSlide,
                        })}

                        {/* <div name="bottom" ref={null} /> */}
                    </motion.div>
                </AnimatePresence>
                {/* )} */}
            </Flex>
        </>
    );
}
