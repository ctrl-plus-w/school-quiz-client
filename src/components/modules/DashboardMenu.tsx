import { useRouter } from 'next/dist/client/router';
import { FunctionComponent } from 'react';
import { useCookies } from 'react-cookie';

import React from 'react';

interface IProps {
  children?: React.ReactNode;
  logoutButton?: boolean;
}

const DashboardMenu: FunctionComponent<IProps> = ({ children, logoutButton = false }: IProps) => {
  const [_cookie, _setCookie, removeCookie] = useCookies(['user']);

  const router = useRouter();

  const handleClick = () => {
    removeCookie('user');
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full px-10 py-12 border-r border-gray-300 flex-shrink-0">
      {children}

      {logoutButton && (
        <a className="text-black font-medium text-base uppercase mt-auto cursor-pointer" onClick={handleClick}>
          Se déconnecter
        </a>
      )}
    </div>
  );
};

export default DashboardMenu;
