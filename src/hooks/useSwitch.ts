import { useEffect, useState } from 'react';

const useSwitch = (key: string, defaultValue = false): boolean => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== key) return;
      setValue((prev) => !prev);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return value;
};

export default useSwitch;
