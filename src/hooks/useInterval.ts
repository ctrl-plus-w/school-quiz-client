import { useEffect, useState } from 'react';

interface IReturnProperties {
  clear: () => void;
}

const useInterval = (cb: () => void, interval: number): IReturnProperties => {
  const [clear, setClear] = useState(false);

  useEffect(() => {
    const intervalFunc = setInterval(cb, interval);
    if (clear) clearInterval(intervalFunc);

    return () => clearInterval(intervalFunc);
  }, [clear]);

  return { clear: () => setClear(true) };
};

export default useInterval;
