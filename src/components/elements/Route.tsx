import Link from 'next/link';

import React from 'react';

interface Props {
  children?: React.ReactNode;
  to: string;
}

const Route = ({ children, to }: Props) => {
  return (
    <Link href={to}>
      <a className="link text-gray-600 font-medium text-base inline">{children}</a>
    </Link>
  );
};

export default Route;
