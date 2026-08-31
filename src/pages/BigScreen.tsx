import ErrorBoundary from "@/components/ErrorBoundary";
import Calendar from "@/components/bigscreen/Calendar";
import Hero from "@/components/bigscreen/Hero";
import Printers from "@/components/bigscreen/Printers";
import QRCodes from "@/components/bigscreen/QRCodes";
import Workshops from "@/components/bigscreen/Workshops";
import useWebhook from "@/hooks/useWebhook";
import { BigScreenSpecialSlide, BigSlide, RawBigSlide } from "@/types";
import { Box, Flex } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import { cloneElement, isValidElement, useCallback, useMemo, useState } from "react";

const SPECIAL_SLIDES: BigScreenSpecialSlide[] = [
    { component: <Hero key="hero" />, id: "HERO" },
    { component: <Printers key="printers" />, id: "QUEUES" },
    { component: <Calendar key="calendar" />, id: "CALENDAR" },
    { component: <Workshops key="workshops" />, id: "WORKSHOPS" },
    { component: <QRCodes key="qrcodes" />, id: "LINKS" },
];

export default function BigScreen() {

    const processSlides = useCallback((data: RawBigSlide[]) => {
        return data as unknown as RawBigSlide[];
    }, []);

    const rawSlides = useWebhook<RawBigSlide[]>("ticker/bigslides", 60000, processSlides);

    const slides = useMemo<BigSlide[]>(() => {
        if (!rawSlides) return [];
        return (rawSlides as RawBigSlide[])
            // Filter out disabled slides
            .filter((s) => s.Enabled)
            // if specialID matches a special slide, use that component instead of the content
            .map((s) => {
                const specialSlide = SPECIAL_SLIDES.find((ss) => ss.id === s.SpecialID);
                console.log(`Slide ${s.Title} (${s.SpecialID}) is ${s.Enabled ? "enabled" : "disabled"}${specialSlide ? ` and is a special slide` : ""}`);
                return {
                    title: s.Title,
                    specialId: s.SpecialID,
                    image: s.Image,
                    component: specialSlide ? specialSlide.component : null,
                    enabled: s.Enabled,
                };
            });
    }, [rawSlides]);

    const [slideIndex, setSlideIndex] = useState(0);

    const incrementSlide = useCallback(() => {
        setSlideIndex((prev) => (prev + 1 >= slides.length ? 0 : prev + 1));
    }, [slides]);

    const currentSlide = useMemo(() => {
        if (slides[slideIndex]?.component) {
            return (
                <Box p="7" width="100%" height="100%">
                    {slides[slideIndex].component}
                </Box>
            )
        } else if (slides[slideIndex]?.image) {
            console.log(slides[slideIndex].image)
            return <img src={slides[slideIndex].image[0].thumbnails.full.url} alt={slides[slideIndex].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
        }
        else {
            return <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>No slide available</div>;
        }
    }, [slides, slideIndex]);

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
