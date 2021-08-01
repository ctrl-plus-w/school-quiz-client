import { createRef, RefObject, useEffect } from 'react';

const useClickOutside = <T extends Element>(func: () => void, updater: Array<any> = []): { container: RefObject<T> } => {
  const container = createRef<T>();

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent): void => {
      const target = e.target as Element;

      if (container.current && container.current !== target && !container.current.contains(target)) {
        // console.log(container.current, target, container.current.isSameNode(target));
        func();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [container, ...updater]);

  return { container };
};

export default useClickOutside;
