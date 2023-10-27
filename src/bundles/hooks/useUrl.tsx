import { useEffect, useState } from 'react';

export function useUrl(): string[] {
    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(window.location.href);
    }, [])

    return [url]
}
