import { FunctionComponent } from 'react';

import React from 'react';

interface IProps {
  level?: number;
  regular?: boolean;
  children?: React.ReactNode;
  color?: 'white' | 'black' | 'red';
}

const Title: FunctionComponent<IProps> = ({ level, children, regular, color = 'black' }: IProps) => {
  const getColor = (): string => {
    switch (color) {
      case 'black':
        return 'black';
      case 'white':
        return 'white';
      case 'red':
        return 'red-800';
    }
  };

  switch (level) {
    case 1:
      return <h1 className={`text-${getColor()} ${regular ? 'font-regular' : 'font-semibold'} text-3xl`}>{children}</h1>;

    case 2:
      return <h2 className={`text-${getColor()} ${regular ? 'font-regular' : 'font-semibold'} text-2xl`}>{children}</h2>;

    case 3:
      return <h3 className={`text-${getColor()} ${regular ? 'font-regular' : 'font-semibold'} text-xl`}>{children}</h3>;

    case 4:
      return <h4 className={`text-${getColor()} ${regular ? 'font-regular' : 'font-medium'} text-xl`}>{children}</h4>;

    default:
      return <h1 className={`text-${getColor()} ${regular ? 'font-regular' : 'font-semibold'} text-3xl`}>{children}</h1>;
  }
};

export default Title;
