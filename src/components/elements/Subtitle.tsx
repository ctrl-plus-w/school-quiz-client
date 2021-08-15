import { FunctionComponent } from 'react';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;
  className: string;
}

const Subtitle: FunctionComponent<IProps> = ({ children, className }: IProps) => {
  return <h3 className={clsx(['text-gray-600 font-medium text-base mt-2', className])}>{children}</h3>;
};

export default Subtitle;
