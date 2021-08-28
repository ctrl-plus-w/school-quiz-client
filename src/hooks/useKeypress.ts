import { useEffect } from 'react';

const useKeypress = (key: string, cb: (e: KeyboardEvent) => void): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== key) return;
      cb(e);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

export default useKeypress;
