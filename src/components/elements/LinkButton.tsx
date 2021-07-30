import Link from 'next/link';
import React from 'react';

interface IProps {
  children?: React.ReactNode;
  href: string;
  className?: string;
  outline?: boolean;
}

const LinkButton = ({ children, href, className, outline = false }: IProps) => {
  const STYLES = {
    DEFAULT: 'bg-black text-white border border-transparent',
    OUTLINE: 'bg-white text-black border border-black',
  };

  return (
    <Link href={href}>
      <a className={`button flex justify-center items-center py-2 px-8 w-full rounded-sm ${outline ? STYLES.OUTLINE : STYLES.DEFAULT} ${className}`}>
        {children}
      </a>
    </Link>
  );
};

export default LinkButton;
