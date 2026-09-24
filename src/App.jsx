import Config from "@/components/Config";
import ErrorBoundary from "@/components/ErrorBoundary";
import { EventsProvider } from "@/contexts/EventsContext";
import { SpotifyProvider } from "@/contexts/SpotifyContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TimeProvider } from "@/contexts/TimeContext";
import useTheme from "@/hooks/useTheme";
import BigScreen from "@/pages/BigScreen";
import Designer from "@/pages/Designer";
import Ticker from "@/pages/Ticker";
import { Box, Flex, Theme } from "@radix-ui/themes";
import { Route, Routes } from "react-router";

function AppShell() {
    const { colorTheme } = useTheme();

    return (
        <Theme accentColor="amber" grayColor="mauve" appearance={colorTheme}>
            <TimeProvider>
                <EventsProvider>
                    <SpotifyProvider>
                        <Box
                            maxWidth="100vw"
                            maxHeight="100vh"
                            minHeight="100vh"
                            minWidth="100vw"
                            width="100vw"
                            height="100vh"
                            overflow="hidden"
                        >
                            <Config />
                            <Flex
                                direction="column"
                                height="100%"
                                width="100%"
                                maxHeight="100vh"
                                overflow="hidden"
                                display="inline-flex"
                            >
                                <Routes>
                                    <Route index element={<Ticker />} />
                                    <Route path="bigscreen" element={<BigScreen />} />
                                    <Route path="designer" element={<Designer />} />
                                </Routes>
                            </Flex>
                        </Box>
                    </SpotifyProvider>
                </EventsProvider>
            </TimeProvider>
        </Theme>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AppShell />
            </ThemeProvider>
        </ErrorBoundary>
    );
}
