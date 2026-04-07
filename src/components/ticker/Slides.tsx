import useTheme from "@/hooks/useTheme";
import useWebhook from "@/hooks/useWebhook";
import type { RawSlide, Slide } from "@/types";
import { Box } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import { animateScroll, Element } from "react-scroll";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const SCROLL_SPEED = 20; // pixels per second
const TIME_PADDING = 2500; // ms buffer between slides

export default function Slides() {
    const { colorTheme } = useTheme();
    const mdRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const currentSlideIndex = useRef(0);

    const [currentSlide, setCurrentSlide] = useState("");

    const processSlides = useCallback((data: RawSlide[]) => {
        return data as unknown as RawSlide[];
    }, []);

    const rawSlides = useWebhook<RawSlide[]>("ticker/slides", 60000, processSlides);

    const slides = useMemo<Slide[]>(() => {
        if (!rawSlides) return [];
        return (rawSlides as RawSlide[])
            .filter((s) => s.Enabled)
            .map((s) => ({ title: s.Title, content: s.Content, enabled: s.Enabled }));
    }, [rawSlides]);

    const runScroll = useCallback((duration: number) => {
        animateScroll.scrollToBottom({
            duration,
            delay: 0,
            smooth: "linear",
            spy: true,
            containerId: "container",
        });
    }, []);

    const runSlide = useCallback(() => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const rect = mdRef.current?.getBoundingClientRect();
                const boxHeight = boxRef.current?.clientHeight ?? 0;
                const scrollDist = rect && rect.y > boxHeight ? rect.y - boxHeight : 0;
                const duration = Math.max(scrollDist / (SCROLL_SPEED / 1000), 5000);

                runScroll(duration);
                setTimeout(resolve, duration + TIME_PADDING);
            }, TIME_PADDING);
        });
    }, [runScroll]);

    const loadSlide = useCallback((slide: Slide | undefined) => {
        if (!slide) {
            setCurrentSlide("");
            return;
        }
        setCurrentSlide(slide.content);
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;

        currentSlideIndex.current = 0;
        let ready = true;

        const interval = setInterval(() => {
            if (!ready || slides.length === 0) return;

            if (currentSlideIndex.current >= slides.length) {
                currentSlideIndex.current = 0;
            }

            animateScroll.scrollToTop({
                duration: 750,
                delay: 0,
                smooth: true,
                spy: true,
                containerId: "container",
            });

            loadSlide(slides[currentSlideIndex.current]);
            ready = false;

            runSlide().then(() => {
                currentSlideIndex.current = (currentSlideIndex.current + 1) % slides.length;
                ready = true;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [runSlide, slides, loadSlide]);

    return (
        <Box minWidth="100%" height="100%" maxWidth="100%" maxHeight="100%" overflow="visible" ref={boxRef}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide || "empty"}
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full max-h-full w-full max-w-full"
                >
                    <Element
                        name="container"
                        id="container"
                        style={{ height: "100%", width: "100%", padding: "40px", overflow: "hidden" }}
                    >
                        <Markdown
                            className={`prose prose-2xl prose-neutral ${colorTheme === "dark" ? "prose-invert" : ""} overflow-hidden`}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {currentSlide}
                        </Markdown>
                        <div ref={mdRef} />
                    </Element>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
}
