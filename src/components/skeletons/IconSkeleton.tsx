import { ReactElement } from 'react';

import React from 'react';

interface IProps {
  size?: number;
  color?: 'gray' | 'blue' | 'red';
}

const IconSkeleton = ({ size = 5, color = 'gray' }: IProps): ReactElement => {
  const getColor = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-400 to-blue-200';

      case 'red':
        return 'from-red-400 to-red-200';

      default:
        return 'from-gray-300 to-gray-100 ';
    }
  };

  return <div className={`w-${size} h-${size} bg-gradient-to-br rounded ${getColor()}`}></div>;
};

export default IconSkeleton;
