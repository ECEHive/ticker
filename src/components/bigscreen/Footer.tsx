import logo from "@/assets/hive_logo_white.svg";
import SpotifyCurrentlyPlaying from "@/components/SpotifyCurrentlyPlaying";
import useTime from "@/hooks/useTime";
import { Flex, Text } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";

export default function Footer({ }) {
    const { time, DIGIT_MAP } = useTime();

    return (
        <Flex direction="row" justify="start" align="center" height="100%">
            <Flex direction="row" justify="start" align="center" flexGrow="1" minWidth="0">
                <Flex direction="row" justify="start" align="center" className='p-6 border-r-[2px] border-solid border-[--sand-7]'>
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


                <Flex flexGrow="2" justify="center" align="center" height="100%" overflow="hidden" px='5' minWidth="0">
                    <SpotifyCurrentlyPlaying titleSize={"text-[2.5rem]"} artistSize={"text-[2.5rem]"} icon={false} dotSize="15px" />
                </Flex>
            </Flex>

            <Flex direction="row" justify="center" align="center" height="100%" minWidth="175px" ml="6" p="5">
                <img src={logo} style={{ width: "auto", height: "90%" }} alt="The Hive" />
            </Flex>
        </Flex >
    )
}