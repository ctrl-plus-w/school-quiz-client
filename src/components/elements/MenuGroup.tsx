import { FunctionComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';

interface IProps {
  title: string;
  links: Array<{ name: string; path: string; active?: boolean }>;
}

const MenuGroup: FunctionComponent<IProps> = ({ title, links = [] }: IProps) => {
  return (
    <ul className="menu-group flex flex-col mb-10">
      <li className="text-black font-semibold text-base uppercase mb-4">{title}</li>

      {links.map(({ name, path, active = false }) => (
        <li className={clsx([active ? 'text-blue-700' : 'text-black', 'font-normal text-base mb-0.5'])} key={uuidv4()}>
          <Link href={path}>
            <a>{name}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuGroup;
