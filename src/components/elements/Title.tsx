import React from 'react';

interface IProps {
  level?: number;
  children?: React.ReactNode;
}

const Title = ({ level, children }: IProps) => {
  switch (level) {
    case 1:
      return <h1 className="text-black font-semibold text-3xl">{children}</h1>;

    default:
      return <h1 className="text-black font-semibold text-3xl">{children}</h1>;
  }
};

export default Title;
