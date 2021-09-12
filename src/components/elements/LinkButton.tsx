import { FunctionComponent } from 'react';

import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;
  href: string;
  className?: string;
  primary?: boolean;
  full?: boolean;
}

const LinkButton: FunctionComponent<IProps> = ({ children, href, className, primary = true, full = true }: IProps) => {
  const getStyle = () => {
    if (primary) return 'bg-blue-800 text-white hover:bg-blue-700 hover:ring hover:ring-blue-300';
    else return 'bg-white text-blue-800 font-medium border border-transparent hover:text-blue-600';
  };

  return (
    <Link href={href}>
      <a
        className={clsx([
          'button flex justify-center items-center py-2 px-8 rounded-sm transition-all duration-300',
          full && 'w-full',
          getStyle(),
          className,
        ])}
      >
        {children}
      </a>
    </Link>
  );
};

export default LinkButton;
