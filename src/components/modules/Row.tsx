import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

interface IProps {
  children?: React.ReactNode;

  className?: string;
}

const Row: FunctionComponent<IProps> = ({ children, className = '' }: IProps) => {
  return <div className={clsx(['row flex flex-row flex-wrap', className])}>{children}</div>;
};

export default Row;
