import { useEffect, useState } from 'react';

const getFocused = (): boolean => {
  return typeof document !== 'undefined' && document.hasFocus();
};

const useWindowFocus = (options?: { focusCb?: () => void; blurCb?: () => void }): boolean => {
  const [focused, setFocused] = useState(getFocused());

  useEffect(() => {
    setFocused(getFocused());

    const onBlur = () => {
      setFocused(false);

      options && options.blurCb && options.blurCb();
    };

    const onFocus = () => {
      setFocused(true);

      options && options.focusCb && options.focusCb();
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [options]);

  return focused;
};

export default useWindowFocus;
