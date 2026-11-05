import { fetchWebhook } from "@/api/webhooks";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebhook(target, refreshInterval, processData) {
    const [data, setData] = useState(null);
    const dataRef = useRef("");
    const processDataRef = useRef(processData);
    processDataRef.current = processData;

    const fetchData = useCallback(async () => {
        const raw = await fetchWebhook(target);
        if (raw === null) return;

        const processed = processDataRef.current ? processDataRef.current(raw) : raw;
        const serialized = JSON.stringify(processed);
        if (serialized === dataRef.current) return;

        dataRef.current = serialized;
        setData(processed);
    }, [target]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, refreshInterval);
        return () => clearInterval(interval);
    }, [fetchData, refreshInterval]);

    return data;
}
