import { createRef, useEffect, useState } from 'react';

import type { RefObject } from 'react';

const useAutoFocus = (enabled = true): RefObject<any> => {
  const input = createRef<HTMLInputElement>();

  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  useEffect(() => {
    if (!input || !input.current || !enabled || hasBeenFocused) return;

    input.current.focus();

    setHasBeenFocused(true);
  }, [input]);

  return input;
};

export default useAutoFocus;
