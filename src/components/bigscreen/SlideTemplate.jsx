import { Flex } from "@radix-ui/themes";
import { useEffect } from "react";

export default function SlideTemplate({ title, callback, timeout, children, fullscreen }) {
    useEffect(() => {
        if (!callback || !timeout) return;
        const timer = setTimeout(callback, timeout);
        return () => clearTimeout(timer);
    }, [timeout, callback]);

    return (
        <>
            {fullscreen && (
                <Flex direction="column" justify="start" align="start" height="100%" width="100%" gap="6">
                    {children}
                </Flex>
            )}
            <Flex direction="column" justify="start" align="start" height="100%" width="100%" gap="6">
                <Flex direction="row" justify="between" align="center" width="100%">
                    <p className="text-6xl font-bold">{title}</p>
                    {/* <img src={hiveLogoWhite} alt="The Hive logo" className="h-12 w-auto" /> */}
                </Flex>
                <Flex direction="column" justify="start" align="start" gap="4" width="100%" height="100%" overflow="hidden">
                    {children}
                </Flex>
            </Flex>
        </>
    );
}
