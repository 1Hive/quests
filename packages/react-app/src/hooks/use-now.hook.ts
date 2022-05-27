import { useEffect, useState } from 'react';

export const useNow = (intervalMs: number = 1000) => {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return now;
};
