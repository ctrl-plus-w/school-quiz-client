import React, { FunctionComponent } from 'react';
import Link from 'next/link';

interface IProps {
  children?: React.ReactNode;
  to: string;
}

const Route: FunctionComponent<IProps> = ({ children, to }: IProps) => {
  return (
    <Link href={to}>
      <a className="link text-gray-600 font-medium text-base">{children}</a>
    </Link>
  );
};

export default Route;
