import { useState, useEffect } from 'react';

const useAriData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/fetch-ari-data?RANGE=Form Responses 1');
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const result = await response.json();
                const filtered = result.values.filter((item, index) => {
                    if ( index === 0 ) false;
                    if ( item.length === 0 || item === null) return false;
                    return true;
                });

                const noMessages = await fetch('/api/fetch-ari-data?RANGE=All');
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const noMessagesResult = await noMessages.json();
                const noMessagesFiltered = noMessagesResult.values.filter((item, index) => {
                    if ( index === 0 ) false;
                    if ( item.length === 0 || item === null) return false;
                    return true;
                });

                const formatted = [ ...filtered, ...noMessagesFiltered].map((item) => {
                    const link = item[3];
                    let gid = null;

                    if (link) {
                        const openIdMatch = link.match(/open\?id=([^&]+)/);
                        const fileIdMatch = link.match(/file\/d\/([^/]+)/);

                        if (openIdMatch) {
                            gid = openIdMatch[1];
                        } else if (fileIdMatch) {
                            gid = fileIdMatch[1];
                        }
                    }
                    return {
                        timestamp: item[0],
                        name: item[1],
                        message: item[2],
                        gid: gid || null,
                        isVideo: item[4] === 'mov' || item[4] === 'mp4',
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