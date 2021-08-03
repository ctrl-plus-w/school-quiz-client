import React, { FunctionComponent } from 'react';

interface IProps {
  children?: React.ReactNode;
}

const Col: FunctionComponent<IProps> = ({ children }: IProps) => {
  return <div className="col control flex flex-col">{children}</div>;
};

export default Col;
