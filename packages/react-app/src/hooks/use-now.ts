import React from 'react';

export const useNow = (isRunning = true) => {
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    let id: any;
    if (isRunning) {
      id = setInterval(() => setNow(Date.now()), 11);
    }
    return () => id && clearInterval(id);
  }, [isRunning]);

  return now;
};
