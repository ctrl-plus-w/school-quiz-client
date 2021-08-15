import React, { JSXElementConstructor, ReactElement } from 'react';

import clsx from 'clsx';

import Link from 'next/link';

import { v4 as uuidv4 } from 'uuid';

interface IProps {
  path: string;
  name: string;
  active: boolean;
  closed: boolean;
  icon: ReactElement | JSXElementConstructor<any>;
}

const MenuItem = ({ path, name, active, icon, closed }: IProps): ReactElement => {
  return (
    <li key={uuidv4()} className={clsx(['transition-all duration-300', active ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'])}>
      <Link href={path}>
        <a className={clsx(['flex flex-row items-center gap-3 font-medium text-base', active ? 'cursor-default' : 'cursor-pointer'])}>
          {icon}
          {!closed && name}
        </a>
      </Link>
    </li>
  );
};

export default MenuItem;
