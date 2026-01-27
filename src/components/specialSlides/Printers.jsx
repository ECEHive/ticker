import { Flex, Grid } from "@radix-ui/themes";

import { motion } from "motion/react";
import { useEffect } from "react";
import { FaCubes, FaRegFaceFrown, FaRegFaceMeh, FaRegFaceSmile } from "react-icons/fa6";
import QRCode from "react-qr-code";
import bambuLogo from "../../assets/printing/bambu.svg";
import formlabsLogo from "../../assets/printing/formlabs.svg";
import useWebhook from "../../hooks/useWebhook";
import SpecialSlideTemplate from "./Template";

export default function Printers({ callback }) {
    const printerStates = useWebhook("queue", 60000, (data) => {
        console.log(data);
        let printers = data;

        // get printer icons
        printers.printers = printers.printers
            .map((printer) => {
                return {
                    ...printer,
                    logo: getPrinterImage(printer.printerModel),
                };
            })
            .sort((a, b) => {
                return a.printerModel.localeCompare(b.printerModel);
            });

        return printers;
    });

    useEffect(() => {
        console.log(printerStates);
    }, [printerStates]);

    const getPrinterImage = (model) => {
        if (model.toLowerCase().includes("formlabs")) return formlabsLogo;
        else if (model.toLowerCase().includes("bambu")) return bambuLogo;
        else return null;
    };

    return (
        <SpecialSlideTemplate title="3D Printer Queues" callback={callback} timeout={20000}>
            <Grid className="auto-rows-fr" width="100%" gap="4" height="100%" columns="3" rows="1fr">
                {printerStates?.printers &&
                    printerStates?.printers.map((printer, index) => {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-start justify-start gap-3 bg-zinc-800 p-5"
                            >
                                <Flex direction="column" gap="3" width="100%">
                                    <span className="w-full text-[2.3rem] leading-none">
                                        <span className="font-semibold text-[--gray-11]">{printer.printerCount}x </span>
                                        <span className="font-bold">{printer.printerModel}</span>
                                    </span>
                                </Flex>

                                <Flex direction="column" justify="start" align="start" gap="4" width="100%">
                                    <Flex direction="row" gap="3" justify="between" align="center" width="100%">
                                        <Flex
                                            direction="row"
                                            gap="2"
                                            justify="start"
                                            align="center"
                                            className="text-[--gray-11]"
                                        >
                                            <FaCubes className="text-[2.1rem]" />

                                            {printer.printerType === "formlabs" ? (
                                                <span className="text-3xl">{printer.printerMaterial} Resin</span>
                                            ) : (
                                                <span className="text-3xl">Mixed plastics</span>
                                            )}
                                        </Flex>

                                        <Flex direction="row" gap="3" justify="start" align="center">
                                            {printer.queuedJobCount === 0 ? (
                                                <>
                                                    <span className="inline-flex gap-3 text-3xl font-medium text-green-100">
                                                        <FaRegFaceSmile className="text-[2.1rem] text-green-200" />
                                                        No wait
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    {printer.queuedJobCount < 3 * printer.printerCount ? (
                                                        <>
                                                            <span className="inline-flex gap-3 text-3xl font-medium text-yellow-100">
                                                                <FaRegFaceMeh className="text-[2.1rem] text-yellow-200" />
                                                                Short wait
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="inline-flex gap-3 text-3xl font-medium text-red-100">
                                                                <FaRegFaceFrown className="text-[2.1rem] text-red-200" />
                                                                Long wait
                                                            </span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </Flex>
                                    </Flex>
                                    {printer.printerCount > 1 && printer.activeJobCount < printer.printerCount && (
                                        <>
                                            <span className="inline-flex items-center gap-0 text-3xl font-medium">
                                                <span className="inline font-semibold">
                                                    {printer.printerCount - printer.activeJobCount}
                                                </span>
                                                <span className="text-[--gray-11]">
                                                    &nbsp;printer
                                                    {printer.printerCount - printer.activeJobCount !== 1
                                                        ? "s"
                                                        : ""}{" "}
                                                    available
                                                </span>
                                            </span>
                                        </>
                                    )}
                                </Flex>

                                <Flex
                                    direction="row"
                                    justify="start"
                                    align="end"
                                    width="100%"
                                    height="100%"
                                    flexGrow="1"
                                ></Flex>
                            </motion.div>
                        );
                    })}
                {printerStates?.meta && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-row items-start justify-start gap-5 p-5"
                    >
                        <Flex direction="row" justify="start" align="start" gap="4" width="100%" height="100%">
                            <p className="h-full w-min text-3xl font-medium">
                                Check your print&apos;s status at hive.pluraprint.com
                            </p>
                            <div className="flex flex-grow flex-row items-start justify-end">
                                <QRCode
                                    value="https://hive.pluraprint.com"
                                    size={175}
                                    bgColor="transparent"
                                    fgColor="white"
                                    className="h-full"
                                />
                            </div>
                        </Flex>

                        {/* <Separator orientation="vertical" size="4" className="mx-4" />

                        <Flex direction="row" justify="between" align="center" gap="9" flexGrow="1" height="100%">
                            <Flex direction="column" justify="start" align="start" gap="1">
                                <p className="text-center font-mono text-6xl font-semibold">
                                    {printerStates?.meta?.activePrinterCount}
                                </p>
                                <Flex direction="row" justify="start" align="center" width="100%">
                                    <p className="text-2xl text-[--gray-11]">Active printers</p>
                                </Flex>
                            </Flex>

                            <Flex direction="column" justify="start" align="start" gap="1">
                                <p className="text-center font-mono text-6xl font-semibold">
                                    {printerStates?.meta?.totalJobCount}
                                </p>
                                <Flex direction="row" justify="start" align="center" width="100%">
                                    <p className="text-2xl text-[--gray-11]">
                                        Print{printerStates?.meta?.totalJobCount > 1 ? "s" : ""} queued
                                    </p>
                                </Flex>
                            </Flex>

                            <Flex direction="column" justify="start" align="start" gap="1">
                                <p className="text-center text-6xl font-semibold">
                                    {dayjs.duration(printerStates?.meta?.totalSeconds || 0, "seconds").humanize()}
                                </p>
                                <Flex direction="row" justify="start" align="center" width="100%">
                                    <p className="text-2xl text-[--gray-11]">Total print time</p>
                                </Flex>
                            </Flex>
                        </Flex> */}
                    </motion.div>
                )}
            </Grid>
        </SpecialSlideTemplate>
    );
}
