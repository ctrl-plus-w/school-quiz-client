import React from 'react';

interface IProps {
  children?: React.ReactNode;
}

const Subtitle = ({ children }: IProps) => {
  return <h3 className="text-gray-600 font-medium text-base mt-2">{children}</h3>;
};

export default Subtitle;
