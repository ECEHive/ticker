import useSpotify from "@/hooks/useSpotify";
import { Button, Flex, Switch, Text } from "@radix-ui/themes";

export default function SpotifyEditor() {
    const { currentToken, redirectToSpotifyAuthorize, logOut, spotifyEnabled, setSpotifyEnabled } = useSpotify();

    return (
        <Flex direction="column" justify="center" align="center" gap="2" width="100%" p="1">
            <Button className="w-56" onClick={redirectToSpotifyAuthorize} disabled={currentToken.access_token !== null}>
                Connect Spotify account
            </Button>
            <Button className="w-56" disabled={currentToken.access_token === null} onClick={logOut}>
                Disconnect Spotify account
            </Button>
            <Flex direction="row" gap="2">
                <Switch radius="small" checked={spotifyEnabled} onCheckedChange={setSpotifyEnabled} />
                <Text size="2">Show music player</Text>
            </Flex>
            <Text mt="5">If the connect thing isn&apos;t working, tell Colin to whitelist you in the spotify app</Text>
        </Flex>
    );
}
