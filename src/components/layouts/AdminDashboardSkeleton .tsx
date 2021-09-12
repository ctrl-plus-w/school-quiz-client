import { useRouter } from 'next/dist/client/router';
import { FunctionComponent } from 'react';

import React from 'react';
import clsx from 'clsx';

import Layout from '@layout/Default';

import MenuSkeleton from '@skeleton/MenuSkeleton';

import ADMIN_MENUS from '@constant/adminMenu';

interface IProps {
  children?: React.ReactNode;

  scroll?: boolean;
}

const AdminDashboardSkeleton: FunctionComponent<IProps> = ({ children, scroll }: IProps) => {
  const router = useRouter();

  const linkMapper = (links: ILink[]) =>
    links.map(({ path, active: _, ...rest }) => ({
      active: path === '/admin' ? router.pathname === path : router.pathname.startsWith(path),
      path,
      ...rest,
    }));

  return (
    <Layout title="Admin Dashboard" display="row">
      <MenuSkeleton logoutButton={true} links={linkMapper(ADMIN_MENUS.links)} />

      <div className={clsx(['flex flex-col flex-grow', scroll && 'overflow-y-scroll'])}>{children}</div>
    </Layout>
  );
};

export default AdminDashboardSkeleton;
