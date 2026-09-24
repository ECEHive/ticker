import { fetchWebhook } from "@/api/webhooks";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebhook(target, refreshInterval, processData) {
    const [data, setData] = useState(null);
    const dataRef = useRef("");

    const fetchData = useCallback(async () => {
        const raw = await fetchWebhook(target);
        if (raw === null) return;

        const processed = processData ? processData(raw) : raw;
        const serialized = JSON.stringify(processed);
        if (serialized === dataRef.current) return;

        dataRef.current = serialized;
        setData(processed);
    }, [target, processData]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, refreshInterval);
        return () => clearInterval(interval);
    }, [fetchData, refreshInterval]);

    return data;
}
