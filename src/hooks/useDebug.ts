import { useEffect } from 'react';

const useDebug = (...vals: any[]): void => {
  useEffect(() => {
    console.log(vals);
  }, vals);
};

export default useDebug;
