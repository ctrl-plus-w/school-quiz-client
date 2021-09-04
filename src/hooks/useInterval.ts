import { useEffect } from 'react';

const useInterval = (cb: () => void, interval: number): void => {
  useEffect(() => {
    const intervalFunc = setInterval(cb, interval);
    return () => clearInterval(intervalFunc);
  }, []);
};

export default useInterval;
