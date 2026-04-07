import { fetchWebhook } from "@/api/webhooks";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebhook<T>(target: string, refreshInterval: number, processData?: (data: T) => T): T | null {
    const [data, setData] = useState<T | null>(null);
    const dataRef = useRef<string>("");

    const fetchData = useCallback(async () => {
        const raw = await fetchWebhook<T>(target);
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
