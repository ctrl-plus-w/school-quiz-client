import { v4 as uuidv4 } from 'uuid';

import type { FunctionComponent } from 'react';

import React from 'react';

import IconSkeleton from '@skeleton/IconSkeleton';

interface IProps {
  links: Array<ILink>;
  logoutButton?: boolean;
}

const MenuSkeleton: FunctionComponent<IProps> = ({ links, logoutButton = false }: IProps) => {
  return (
    <div className="flex flex-col justify-between px-10 py-16 border-r border-gray-300 flex-shrink-0 flex-grow-0">
      <div className="flex justify-start mb-16">
        <IconSkeleton size={7} />
      </div>

      <ul className="flex flex-col gap-6 h-full">
        {links.map(({ active }) => (
          <IconSkeleton size={6} key={uuidv4()} color={active ? 'blue' : 'gray'} />
        ))}

        {logoutButton && (
          <li className="mt-auto text-gray-black">
            <IconSkeleton size={6} />
          </li>
        )}
      </ul>
    </div>
  );
};

export default MenuSkeleton;
