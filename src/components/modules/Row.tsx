import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

interface IProps {
  children?: React.ReactNode;

  className?: string;

  wrap?: boolean;
}

const Row: FunctionComponent<IProps> = ({ children, wrap, className = '' }: IProps) => {
  return <div className={clsx(['row flex flex-row', wrap && 'flex-wrap', className])}>{children}</div>;
};

export default Row;
