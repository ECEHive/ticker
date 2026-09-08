import useSpotify from "@/hooks/useSpotify";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { FaMusic } from "react-icons/fa6";

interface SpotifyCurrentlyPlayingProps {
    titleSize?: string;
    artistSize?: string;
    iconSize?: number;
    dotSize?: string;
    icon?: boolean;
}

export default function SpotifyCurrentlyPlaying({
    titleSize = "text-[3.5rem]",
    artistSize = "text-[3.4rem]",
    iconSize = 40,
    dotSize = "25px",
    icon = true,
}: SpotifyCurrentlyPlayingProps) {
    const { playerState, spotifyEnabled } = useSpotify();

    const [playMarquee, setPlayMarquee] = useState(true);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [enableMarquee, setEnableMarquee] = useState(false);
    const [disableWait, setDisableWait] = useState(false);
    const titleRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    const pauseMarquee = useCallback(() => {
        if (enableMarquee) {
            setPlayMarquee(false);
            setTimeout(() => setPlayMarquee(true), disableWait ? 0 : 5000);
        } else {
            setPlayMarquee(false);
        }
    }, [enableMarquee, disableWait]);

    useEffect(() => {
        if (!playerState?.item) return;

        const checkWidth = () => {
            if (titleRef.current && infoRef.current) {
                // If the content width is greater than the container width, enable marquee
                setEnableMarquee(titleRef.current.offsetWidth > infoRef.current.offsetWidth);
            }
        };

        if (currentTrackId !== playerState.item.id) {
            setCurrentTrackId(playerState.item.id);
            setEnableMarquee(false); // Reset to non-marquee to measure natural width
            setDisableWait(true);
            setPlayMarquee(true);

            // Wait for React to render the non-marquee TrackInfo, then measure
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    checkWidth();
                    setDisableWait(false);
                });
            });
        }
    }, [playerState, currentTrackId]);

    // Also re-check on window resize
    useEffect(() => {
        const handleResize = () => {
            if (titleRef.current && infoRef.current) {
                const needsMarquee = titleRef.current.offsetWidth > infoRef.current.offsetWidth;
                setEnableMarquee(needsMarquee);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const track = playerState?.item;
    if (!spotifyEnabled || !track) return null;

    const artistNames = track?.artists?.map((a) => a.name).join(", ") ?? "";

    const TrackInfo = (
        <Flex dir="row" justify="center" align="center" gap="2" ref={titleRef} className="whitespace-nowrap">
            <p className={`${titleSize} font-semibold leading-none text-gray-50 py-2`}>{track?.name}</p>
            <DotFilledIcon width={dotSize} height={dotSize} className="mx-2" />
            <p className={`${artistSize} font-normal leading-none text-gray-300 py-2`}>{artistNames}</p>
        </Flex>
    );

    return (
        <Flex
            width="100%"
            height="100%"
            maxHeight="100%"
            maxWidth="100%"
            overflow="hidden"
            direction="row"
            align="center"
            justify="start"
            gap="5"
        >
            {icon && <FaMusic size={iconSize} />}
            <Flex
                direction="column"
                align="start"
                justify="center"
                gap="4"
                width="100%"
                maxWidth="100%"
                height="100%"
                overflow="hidden"
            >
                <Flex
                    direction="column"
                    align="start"
                    justify="start"
                    gap="4"
                    width="100%"
                    maxWidth="100%"
                    overflow="hidden"
                    ref={infoRef}
                >
                    {enableMarquee ? (
                        <Marquee
                            onCycleComplete={pauseMarquee}
                            play={playMarquee}
                            loop={0}
                            style={{
                                overflow: "hidden",
                                maskImage:
                                    "linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 10%)",
                            }}
                        >
                            <Flex dir="row" justify="center" align="center" gap="2" ref={titleRef}>
                                <p className={`${titleSize} font-semibold leading-none text-gray-50 py-2`}>
                                    {track.name}
                                </p>
                                <DotFilledIcon width={dotSize} height={dotSize} className="mx-2" />
                                <p className={`${artistSize} font-normal leading-none text-gray-300 py-2`}>
                                    {artistNames}
                                </p>
                                <div style={{ width: "120px" }} />
                            </Flex>
                        </Marquee>
                    ) : (
                        TrackInfo
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}
