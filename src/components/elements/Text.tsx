import React, { FunctionComponent } from 'react';

interface IProps {
  children: string;
  color?: 'white' | 'red' | 'black';
  small?: boolean;
}

const Text: FunctionComponent<IProps> = ({ children, color = 'black', small = false }: IProps) => {
  const getColor = (): string => {
    switch (color) {
      case 'white':
        return 'white';
      case 'black':
        return 'black';
      case 'red':
        return 'red-800';
    }
  };

  return <p className={`text-${getColor()} font-normal text-${small ? 'sm' : 'base'}`}>{children}</p>;
};

export default Text;
