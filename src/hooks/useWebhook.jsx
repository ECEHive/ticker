import { useCallback, useEffect, useState } from "react";

export default function useWebhook(target, refreshInterval, processData = null) {
    const [fetchedData, setData] = useState([]);

    const fetchData = useCallback(async () => {
        fetch(`https://n8n.hivemakerspace.com/webhook/${target}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("couldn't fetch webhook data");
                }
                return response.json();
            })
            .then((data) => {
                let processedData = processData ? processData(data) : data;
                if (JSON.stringify(processedData) === JSON.stringify(fetchedData)) return;
                setData(processedData);
            })
            .catch((error) => {
                console.error("Error fetching info slides:", error);
            });
    }, [fetchedData, target, processData]);

    useEffect(() => {
        let interval = setInterval(() => {
            fetchData();
        }, refreshInterval);

        fetchData();

        return () => {
            clearInterval(interval);
        };
    }, [fetchData, refreshInterval]);

    return fetchedData;
}
