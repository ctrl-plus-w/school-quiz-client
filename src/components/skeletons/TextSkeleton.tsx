import type { ReactElement } from 'react';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  width?: number;
  height?: number;

  className?: string;

  color?: 'gray' | 'blue';
}

const TextSkeleton = ({ width = 32, height = 4, color = 'gray', className }: IProps): ReactElement => {
  return (
    <div
      className={clsx([
        `h-${height} w-${width} bg-gradient-to-br rounded`,
        color === 'gray' && 'from-gray-300 to-gray-100',
        color === 'blue' && 'from-blue-300 to-blue-200',
        className,
      ])}
    ></div>
  );
};

export default TextSkeleton;
