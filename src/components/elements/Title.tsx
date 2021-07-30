import React, { FunctionComponent } from 'react';

interface IProps {
  level?: number;
  children?: React.ReactNode;
  color?: 'white' | 'black' | 'red';
}

const Title: FunctionComponent<IProps> = ({ level, children, color = 'black' }: IProps) => {
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
      return <h1 className={`text-${getColor()} font-semibold text-3xl`}>{children}</h1>;

    case 2:
      return <h1 className={`text-${getColor()} font-semibold text-2xl`}>{children}</h1>;

    case 3:
      return <h1 className={`text-${getColor()} font-semibold text-xl`}>{children}</h1>;

    default:
      return <h1 className={`text-${getColor()} font-semibold text-3xl`}>{children}</h1>;
  }
};

export default Title;
