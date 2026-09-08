import logo from "@/assets/hive_logo_white.svg";
import useTime from "@/hooks/useTime";
import { Flex, Text } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";

export default function Footer({ }) {
    const { time, DIGIT_MAP } = useTime();

    return (
        <Flex direction="row" justify="start" align="center" height="100%">
            <Flex direction="row" justify="start" align="center" flexGrow="1">
                {/* clock */}
                {DIGIT_MAP.map((getDigit, index) => (
                    <AnimatePresence mode="popLayout" key={index}>
                        <motion.div
                            key={getDigit(time[0])}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <p
                                className={`${getDigit(time[0]) !== ":"
                                    ? "font-mono text-[3.2rem] font-semibold"
                                    : "font-sans text-[3.2rem] font-medium"
                                    } leading-none`}
                            >
                                {getDigit(time[0])}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                ))}
                <Text className="self-end font-mono text-3xl font-medium">{time[1]}</Text>
            </Flex>
            <Flex direction="row" justify="center" align="center" height="100%" p="1">
                <img src={logo} style={{ width: "auto", height: "100%" }} alt="The Hive" />
            </Flex>
        </Flex>
    )
}