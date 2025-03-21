
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useUrlParams<T extends Record<string, string>>(): T {
  const [params, setParams] = useState<T>({} as T);
  const location = useLocation();

  useEffect(() => {
    // Process query parameters
    const searchParams = new URLSearchParams(location.search);
    const urlParams: Record<string, string> = {};
    
    for (const [key, value] of searchParams.entries()) {
      urlParams[key] = value;
    }
    
    // Also check for hash parameters (some systems might use hash fragments)
    if (location.hash) {
      // Remove the leading # and parse as search params
      const hashParams = new URLSearchParams(location.hash.substring(1));
      for (const [key, value] of hashParams.entries()) {
        urlParams[key] = value;
      }
    }
    
    // Log for debugging
    console.log('URL Parameters extracted:', urlParams);
    
    setParams(urlParams as T);
  }, [location.search, location.hash]);

  return params;
}
