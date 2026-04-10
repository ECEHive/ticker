import useTheme from "@/hooks/useTheme";
import { playAudio } from "@/utils/audio";
import { Button, Flex, Switch, Text } from "@radix-ui/themes";
import { useCallback } from "react";
import chime3 from "@/assets/audio/chime_3.mp3";

export default function GeneralEditor() {
    const { colorTheme, toggleColorTheme } = useTheme();

    const testAudio = useCallback(() => {
        playAudio(chime3);
    }, []);

    return (
        <Flex direction="column" justify="center" align="center" width="100%" p="1" gap="4">
            <Flex direction="row" gap="2">
                <Switch radius="small" checked={colorTheme === "light"} onCheckedChange={toggleColorTheme} />
                <Text size="2">Light mode</Text>
            </Flex>
            <Button onClick={testAudio}>Test audio</Button>
        </Flex>
    );
}
