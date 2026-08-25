import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/ticker/Footer";
import Slides from "@/components/ticker/Slides";
import SpaceInfo from "@/components/ticker/SpaceInfo";
import { Slide } from "@/types";
import { Editor } from "@monaco-editor/react";
import { Box, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";

export default function Designer() {

    const [slidesOverride, setSlidesOverride] = useState<Slide[] | undefined>(undefined);
    const [editorValue, setEditorValue] = useState<string>("");

    return (

        // modal with markdown input 

        <>
            <Flex direction="column" height="100%" minHeight="0px" width="100%" position="relative" overflow="auto">
                <Flex direction="column" height="100%" minHeight="100vh" minWidth="600px" width="100%" position="relative" p="6" gap="6">
                    <Editor defaultLanguage="markdown"
                        onChange={(value) => {
                            setEditorValue(value || "");
                        }}
                    />
                    <Flex direction="row" width="100%" gap="6">
                        <Button className="" onClick={() => setSlidesOverride(undefined)}>Reset</Button>
                        <Button className="" onClick={() => {
                            setSlidesOverride([{
                                title: "My Slide",
                                content: editorValue,
                                enabled: true,
                            }])
                            console.log("slidesOverride", slidesOverride);
                        }}>Save</Button>
                    </Flex>
                </Flex>
                <Flex direction="column" height="100%" minHeight="100vh" width="100%" position="relative" overflow="auto">
                    <Flex direction="row" height="100%" minHeight="0px" width="100%" position="relative">
                        <Box width="auto" height="100%" className="border-r-[3px] border-solid border-[--sand-7]">
                            <ErrorBoundary>
                                <SpaceInfo />
                            </ErrorBoundary>
                        </Box>
                        <Box width="100%" height="100%">
                            <ErrorBoundary>
                                <Slides slidesOverride={slidesOverride} />
                            </ErrorBoundary>
                        </Box>
                    </Flex>
                    <Box height="auto" width="100%" className="border-t-[3px] border-solid border-[--sand-7]">
                        <ErrorBoundary>
                            <Footer />
                        </ErrorBoundary>
                    </Box>
                </Flex>
            </Flex>
        </>
    );
}