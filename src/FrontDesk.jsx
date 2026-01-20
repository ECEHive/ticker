import { Flex } from "@radix-ui/themes";
import Alert from "./components/MainAlert";
// import Workshops from "./components/specialSlides/Workshops";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hero from "./components/specialSlides/Hero";
import Printers from "./components/specialSlides/Printers";
import Workshops from "./components/specialSlides/Workshops";
import useTime from "./hooks/useTime";

export default function FrontDesk({}) {
    const { alertActive, openState } = useTime();

    const slidesAll = useMemo(
        () => [
            {
                component: <Hero key="hero" />,
                duration: 10000,
                skip: false,
            },
            {
                component: <Printers key="printers" />,
                duration: 20000,
                skipIfClosed: true,
            },
            {
                component: <Workshops key="workshops" />,
                duration: 20000,
                skipIfClosed: true,
            },
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

    const currentSlideIndex = useRef(0);
    const [currentSlide, setCurrentSlide] = useState(null);

    const loadSlide = useCallback((slide) => {
        setCurrentSlide(slide);
    }, []);

    const runSlide = useCallback((delay) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    }, []);

    const incrimentSlide = useCallback(() => {
        // currentSlideIndex.current += 1;

        if (currentSlideIndex.current + 1 >= slides.length) {
            currentSlideIndex.current = 0;
        } else {
            currentSlideIndex.current += 1;
        }
    }, [slides]);

    useEffect(() => {
        currentSlideIndex.current = 0;
        loadSlide(slides[0].component);

        let ready = true;
        const interval = setInterval(() => {
            if (!ready) return;

            incrimentSlide();

            loadSlide(slides[currentSlideIndex.current].component);
            ready = false;
            runSlide(slides[currentSlideIndex.current].duration).then(() => {
                ready = true;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [loadSlide, slides, runSlide, incrimentSlide]);

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
                    incrimentSlide();
                    loadSlide(slides[currentSlideIndex.current].component);
                }}
            >
                {alertActive ? (
                    <>
                        <Alert />
                    </>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            // fade the div when currentSlide changes
                            key={currentSlideIndex.current || "empty"}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full max-h-full w-full max-w-full"
                        >
                            {currentSlide}
                            {/* <div name="bottom" ref={null} /> */}
                        </motion.div>
                    </AnimatePresence>
                )}
            </Flex>
        </>
    );
}
