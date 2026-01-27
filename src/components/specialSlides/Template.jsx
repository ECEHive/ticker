import { Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import hiveLogoWhite from "../../assets/hive_logo_white.svg";

export default function SpecialSlideTemplate({ title, callback = null, timeout = null, children }) {
    useEffect(() => {
        if (!callback || !timeout) return;
        let timer;
        if (timeout && callback) {
            timer = setTimeout(() => {
                callback();
            }, timeout);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [timeout, callback]);

    return (
        <Flex direction="column" justify="start" align="start" height="100%" width="100%" gap="6">
            <Flex direction="row" justify="between" align="center" width="100%">
                <p className="text-6xl font-bold">{title}</p>
                <img src={hiveLogoWhite} alt="The Hive logo" className="h-12 w-auto" />
            </Flex>

            <Flex direction="column" justify="start" align="start" gap="4" width="100%" height="100%" overflow="hidden">
                {children}
            </Flex>
        </Flex>
    );
}
