import ErrorBoundary from "@/components/ErrorBoundary";
import MainAlert from "@/components/MainAlert";
import Footer from "@/components/ticker/Footer";
import Slides from "@/components/ticker/Slides";
import SpaceInfo from "@/components/ticker/SpaceInfo";
import useTime from "@/hooks/useTime";
import { Box, Flex } from "@radix-ui/themes";

export default function Ticker() {
    const { alertActive } = useTime();

    return (
        <>
            <Flex direction="row" height="100%" minHeight="0px" width="100%" position="relative">
                <Box width="auto" height="100%" className="border-r-[3px] border-solid border-[--sand-7]">
                    <ErrorBoundary>
                        <SpaceInfo />
                    </ErrorBoundary>
                </Box>
                <Box width="100%" height="100%">
                    <ErrorBoundary>{alertActive ? <MainAlert /> : <Slides />}</ErrorBoundary>
                </Box>
            </Flex>
            <Box height="auto" width="100%" className="border-t-[3px] border-solid border-[--sand-7]">
                <ErrorBoundary>
                    <Footer />
                </ErrorBoundary>
            </Box>
        </>
    );
}
