import { FunctionComponent, useState } from 'react';

import React from 'react';

interface IProps {
  level?: number;
}

const TitleSkeleton: FunctionComponent<IProps> = ({ level }: IProps) => {
  const [className] = useState('w-80 text-transparent bg-gradient-to-br from-gray-300 to-gray-100 rounded');

  switch (level) {
    case 1:
      return <div className={`h-9 ${className}`}></div>;

    case 2:
      return <div className={`h-8 ${className}`}></div>;

    case 3:
      return <div className={`h-7 ${className}`}></div>;

    case 4:
      return <div className={`h-7 ${className}`}></div>;

    default:
      return <div className={`h-9 ${className}`}></div>;
  }
};

export default TitleSkeleton;
