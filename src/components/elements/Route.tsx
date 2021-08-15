import { FunctionComponent } from 'react';

import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;
  to: string;
  className?: string;
}

const Route: FunctionComponent<IProps> = ({ children, className, to }: IProps) => {
  return (
    <Link href={to}>
      <a className={clsx(['link text-gray-600 font-medium text-base', className])}>{children}</a>
    </Link>
  );
};

export default Route;
