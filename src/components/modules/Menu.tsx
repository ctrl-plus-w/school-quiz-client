import React from 'react';

import { useRouter } from 'next/dist/client/router';
import { useCookies } from 'react-cookie';

interface IProps {
  children?: React.ReactNode;
  logoutButton?: boolean;
}

const Menu = ({ children, logoutButton = false }: IProps) => {
  const [_cookie, _setCookie, removeCookie] = useCookies(['user']);

  const router = useRouter();

  const handleClick = () => {
    removeCookie('user');
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full px-10 py-12 border-r border-gray-300">
      {children}

      {logoutButton && (
        <a className="text-black font-medium text-base uppercase mt-auto cursor-pointer" onClick={handleClick}>
          Se déconnecter
        </a>
      )}
    </div>
  );
};

export default Menu;
