import React from 'react';

interface IProps {
  children?: React.ReactNode;
}

const Row = ({ children }: IProps) => {
  return <div className="flex flex-row flex-wrap w-full">{children}</div>;
};

export default Row;
