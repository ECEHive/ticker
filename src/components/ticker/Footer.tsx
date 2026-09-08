import logo from "@/assets/hive_logo_white.svg";
import SpotifyCurrentlyPlaying from "@/components/SpotifyCurrentlyPlaying";
import useSpotify from "@/hooks/useSpotify";
import useTheme from "@/hooks/useTheme";
import { Box, Flex } from "@radix-ui/themes";

export default function Footer() {
    const { playerState, spotifyEnabled } = useSpotify();
    const { colorTheme } = useTheme();

    const track = playerState?.item;
    const albumArtUrl = track?.album?.images?.[0]?.url;

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
                        p="6"
                    >
                        <SpotifyCurrentlyPlaying iconSize={40} />
                    </Flex>

                    <Flex direction="column" justify="center" align="end" width="auto" height="100%" p="6">
                        <img src={logo} style={{ width: "auto", height: "100%" }} alt="The Hive" />
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
}
