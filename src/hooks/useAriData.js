import { useState, useEffect } from 'react';

const useAriData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/fetch-ari-data');
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const result = await response.json();
                const filtered = result.values.filter((item, index) => {
                    if ( index === 0 ) false;
                    if ( item.length === 0 || item === null) return false;
                    return true;
                });

                const formatted = filtered.map((item) => {
                    return {
                        timestamp: item[0],
                        name: item[1],
                        message: item[2],
                        gid: item[3]?.split('id=')[1] || null,
                    };
                });
                setData(formatted);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useAriData;