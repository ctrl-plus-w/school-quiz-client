import type { ReactElement } from 'react';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  width?: number;
  height?: number;

  className?: string;
}

const TextSkeleton = ({ width = 32, height = 4, className }: IProps): ReactElement => {
  return <div className={clsx([`h-${height} w-${width} bg-gradient-to-br from-gray-300 to-gray-100 rounded`, className])}></div>;
};

export default TextSkeleton;
