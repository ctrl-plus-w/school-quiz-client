import Link from 'next/link';

import React from 'react';

interface IProps {
  children?: React.ReactNode;
  to: string;
}

const Route = ({ children, to }: IProps) => {
  return (
    <Link href={to}>
      <a className="link text-gray-600 font-medium text-base">{children}</a>
    </Link>
  );
};

export default Route;
