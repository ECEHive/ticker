import useSpotify from "@/hooks/useSpotify";
import useTheme from "@/hooks/useTheme";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { Box, Flex } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { FaMusic } from "react-icons/fa6";
import logo from "@/assets/hive_logo_white.svg";

export default function Footer() {
    const { playerState, spotifyEnabled } = useSpotify();
    const { colorTheme } = useTheme();

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
        if (!titleRef.current || !infoRef.current || !playerState?.item) return;
        if (currentTrackId !== playerState.item.id) {
            setCurrentTrackId(playerState.item.id);
            setEnableMarquee(true);
            setDisableWait(true);
            setPlayMarquee(true);

            setTimeout(() => {
                if (titleRef.current && infoRef.current) {
                    setEnableMarquee(titleRef.current.offsetWidth > infoRef.current.offsetWidth);
                }
                setDisableWait(false);
            }, 1);
        }
    }, [playerState, currentTrackId, titleRef, infoRef, setCurrentTrackId]);

    const track = playerState?.item;
    const albumArtUrl = track?.album?.images?.[0]?.url;
    const artistNames = track?.artists?.map((a) => a.name).join(", ") ?? "";

    const TrackInfo = (
        <Flex dir="row" justify="center" align="center" gap="2" ref={titleRef} className="whitespace-nowrap">
            <p className="text-[3.5rem] font-semibold leading-none text-gray-50">{track?.name}</p>
            <DotFilledIcon width="25px" height="25px" className="mx-2" />
            <p className="text-[3.4rem] font-normal leading-none text-gray-300">{artistNames}</p>
        </Flex>
    );

    return (
        <Box height="auto" width="100%" maxWidth="100%" minWidth="100%">
            <Box
                className="h-[130px] w-full"
                style={{
                    backgroundImage: spotifyEnabled && albumArtUrl ? `url('${albumArtUrl}')` : undefined,
                    backgroundSize: "100% auto",
                    backgroundPosition: "center",
                    backgroundClip: "border-box",
                }}
            >
                <Flex
                    direction="row"
                    align="center"
                    justify="between"
                    width="100%"
                    height="100%"
                    style={{
                        backdropFilter:
                            spotifyEnabled && playerState
                                ? `blur(75px) ${colorTheme === "dark" ? "brightness(0.2)" : "brightness(0.7)"}`
                                : undefined,
                    }}
                >
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
                        p="6"
                    >
                        {spotifyEnabled && track && (
                            <>
                                <FaMusic size={40} />
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
                                                    <p className="text-[3.5rem] font-semibold leading-none text-gray-50">
                                                        {track.name}
                                                    </p>
                                                    <DotFilledIcon width="25px" height="25px" className="mx-2" />
                                                    <p className="text-[3.4rem] font-normal leading-none text-gray-300">
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
                            </>
                        )}
                    </Flex>

                    <Flex direction="column" justify="center" align="end" width="auto" height="100%" p="6">
                        <img src={logo} style={{ width: "auto", height: "100%" }} alt="The Hive" />
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
}
