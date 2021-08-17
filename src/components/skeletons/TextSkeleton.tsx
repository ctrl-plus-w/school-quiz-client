import { ReactElement, useState } from 'react';

import React from 'react';
import clsx from 'clsx';

import { random } from '@util/array.utils';

interface IProps {
  width?: number;
  height?: number;

  randomWidth?: boolean;
  max?: number;

  className?: string;
}

const WIDTHS = [24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96];

const TextSkeleton = ({ width = 96, height = 4, randomWidth, max, className }: IProps): ReactElement => {
  const [textWidth] = useState(randomWidth ? random(max ? WIDTHS.filter((el) => el <= max) : WIDTHS) : width);
  return <div className={clsx([`h-${height} w-${textWidth} bg-gradient-to-br from-gray-300 to-gray-100 rounded`, className])}></div>;
};

export default TextSkeleton;
