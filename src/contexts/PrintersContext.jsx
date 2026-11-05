import bambuLogo from "@/assets/printing/bambu.svg";
import formlabsLogo from "@/assets/printing/formlabs.svg";
import useWebhook from "@/hooks/useWebhook";
import { createContext, useCallback, useMemo } from "react";

export const PrintersContext = createContext(null);

function getPrinterImage(model) {
    const lower = model.toLowerCase();
    if (lower.includes("formlabs")) return formlabsLogo;
    if (lower.includes("bambu")) return bambuLogo;
    return undefined;
}

export function PrintersProvider({ children }) {
    const processData = useCallback((data) => {
        return {
            ...data,
            printers: data.printers
                .map((p) => ({ ...p, logo: getPrinterImage(p.printerModel) }))
                .sort((a, b) => a.printerModel.localeCompare(b.printerModel)),
        };
    }, []);

    const printerStates = useWebhook("queue", 60000, processData);

    const value = useMemo(() => ({ printerStates }), [printerStates]);

    return (
        <PrintersContext.Provider value={value}>
            {children}
        </PrintersContext.Provider>
    );
}

