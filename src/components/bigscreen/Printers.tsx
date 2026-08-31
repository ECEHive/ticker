import useWebhook from "@/hooks/useWebhook";
import type { PrinterGroup, PrinterQueueData } from "@/types";
import { Flex, Grid, Spinner } from "@radix-ui/themes";
import { motion } from "motion/react";
import QRCode from "react-qr-code";
import { FaCubes, FaRegFaceFrown, FaRegFaceMeh, FaRegFaceSmile } from "react-icons/fa6";
import bambuLogo from "@/assets/printing/bambu.svg";
import formlabsLogo from "@/assets/printing/formlabs.svg";
import SlideTemplate from "./SlideTemplate";
import { useCallback } from "react";

interface PrintersProps {
    callback?: () => void;
}

function getPrinterImage(model: string): string | undefined {
    const lower = model.toLowerCase();
    if (lower.includes("formlabs")) return formlabsLogo;
    if (lower.includes("bambu")) return bambuLogo;
    return undefined;
}

function getBambuMaterials(model: string): string {
    const lower = model.toLowerCase();
    if (lower.includes("p1s")) return "PLA, TPU";
    if (lower.includes("h2d") || lower.includes("h2s")) return "Specialty";
    return "";
}

function QueueStatus({ printer }: { printer: PrinterGroup }) {
    if (printer.queuedJobCount === 0) {
        return (
            <span className="inline-flex gap-3 text-3xl font-medium text-green-100">
                <FaRegFaceSmile className="text-[2.1rem] text-green-200" />
                No wait
            </span>
        );
    }

    if (printer.queuedJobCount < 3 * printer.printerCount) {
        return (
            <span className="inline-flex gap-3 text-3xl font-medium text-yellow-100">
                <FaRegFaceMeh className="text-[2.1rem] text-yellow-200" />
                Short wait
            </span>
        );
    }

    return (
        <span className="inline-flex gap-3 text-3xl font-medium text-red-100">
            <FaRegFaceFrown className="text-[2.1rem] text-red-200" />
            Long wait
        </span>
    );
}

function PrinterCard({ printer }: { printer: PrinterGroup }) {
    const availableCount = printer.printerCount - printer.activeJobCount;

    return (
        <motion.div
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
                    <Flex direction="row" gap="2" justify="start" align="center" className="text-[--gray-11]">
                        <FaCubes className="text-[2.1rem]" />
                        {printer.printerType === "formlabs" ? (
                            <span className="text-3xl">{printer.printerMaterial} Resin</span>
                        ) : (
                            <span className="text-3xl">{getBambuMaterials(printer.printerModel)}</span>
                        )}
                    </Flex>
                    <Flex direction="row" gap="3" justify="start" align="center">
                        <QueueStatus printer={printer} />
                    </Flex>
                </Flex>

                {printer.printerCount > 1 && availableCount > 0 && (
                    <span className="inline-flex items-center gap-0 text-3xl font-medium">
                        <span className="inline font-semibold">{availableCount}</span>
                        <span className="text-[--gray-11]">
                            &nbsp;printer{availableCount !== 1 ? "s" : ""} available
                        </span>
                    </span>
                )}
            </Flex>

            <Flex direction="row" justify="start" align="end" width="100%" height="100%" flexGrow="1" />
        </motion.div>
    );
}

export default function Printers({ callback }: PrintersProps) {
    const processData = useCallback((data: PrinterQueueData) => {
        return {
            ...data,
            printers: data.printers
                .map((p) => ({ ...p, logo: getPrinterImage(p.printerModel) }))
                .sort((a, b) => a.printerModel.localeCompare(b.printerModel)),
        };
    }, []);

    const printerStates = useWebhook<PrinterQueueData>("queue", 60000, processData);

    return (
        <SlideTemplate title="3D Printer Queues" callback={callback} timeout={20000}>
            {printerStates?.printers ? (
                <Grid className="auto-rows-fr" width="100%" gap="4" height="100%" columns="3" rows="1fr">
                    {printerStates.printers.map((printer, index) => (
                        <PrinterCard key={index} printer={printer} />
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-row items-start justify-start gap-5 p-5"
                    >
                        <Flex direction="row" justify="start" align="start" gap="4" width="100%" height="100%">
                            <p className="h-full w-min text-3xl font-medium">
                                Check your Bambu print&apos;s status at hive.pluraprint.com
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
                    </motion.div>
                </Grid>
            ) : (
                <Flex
                    direction="row"
                    height="100%"
                    width="100%"
                    justify="center"
                    align="center"
                    gap="4"
                    className="text-[--gray-11]"
                >
                    <Spinner size="3" />
                    <span className="text-4xl font-medium">Fetching the latest data...</span>
                </Flex>
            )}
        </SlideTemplate>
    );
}
