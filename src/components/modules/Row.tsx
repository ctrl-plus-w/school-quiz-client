import React, { FunctionComponent } from 'react';

interface IProps {
  children?: React.ReactNode;
}

const Row: FunctionComponent<IProps> = ({ children }: IProps) => {
  return <div className="form-control flex flex-row flex-wrap w-full">{children}</div>;
};

export default Row;
