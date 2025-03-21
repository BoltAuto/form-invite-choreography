
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useUrlParams<T extends Record<string, string>>(): T {
  const [params, setParams] = useState<T>({} as T);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlParams: Record<string, string> = {};
    
    for (const [key, value] of searchParams.entries()) {
      urlParams[key] = value;
    }
    
    setParams(urlParams as T);
  }, [location.search]);

  return params;
}
