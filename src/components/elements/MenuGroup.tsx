import Link from 'next/link';
import React from 'react';

interface IProps {
  title: string;
  links: Array<{ name: string; path: string; active?: boolean }>;
}

const MenuGroup = ({ title, links = [] }: IProps) => {
  return (
    <ul className="menu-group flex flex-col mb-10">
      <li className="text-black font-medium text-base uppercase mb-4">{title}</li>

      {links.map(({ name, path, active = false }) => (
        <li className={`${active ? 'text-green-600' : 'text-gray-600'} font-normal text-base mb-0.5`}>
          <Link href={path}>
            <a>{name}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuGroup;
