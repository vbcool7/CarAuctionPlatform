
// for redirect to buyer / seller dashboard - from navbar menus

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useDeepLinkPage = (allowedPages, fallback) => {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [initialPage] = useState(() => {
        const page = searchParams.get('page');
        return allowedPages.includes(page) ? page : fallback;
    });

    useEffect(() => {
        if (searchParams.has('page')) {
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    return initialPage;
};