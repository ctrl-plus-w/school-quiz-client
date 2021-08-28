import { useState } from 'react';

import useKeypress from '@hooks/useKeypress';

const useSwitch = (key: string, defaultValue = false): boolean => {
  const [value, setValue] = useState(defaultValue);

  useKeypress(key, () => setValue((prev) => !prev));

  return value;
};

export default useSwitch;
