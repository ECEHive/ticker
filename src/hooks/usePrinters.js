import { PrintersContext } from "@/contexts/PrintersContext";
import { useContext } from "react";

export default function usePrinters() {
    const context = useContext(PrintersContext);
    if (!context) {
        throw new Error("usePrinters must be used within a PrintersProvider");
    }
    return context;
}

