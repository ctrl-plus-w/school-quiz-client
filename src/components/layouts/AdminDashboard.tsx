import { useRouter } from 'next/dist/client/router';
import { FunctionComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import React from 'react';

import Layout from '@layout/Default';

import DashboardMenu from '@module/DashboardMenu';

import MenuGroup from '@element/MenuGroup';

import ADMIN_MENUS from '@constant/adminMenu';

interface IProps {
  children?: React.ReactNode;
}

const AdminDashboardLayout: FunctionComponent<IProps> = ({ children }: IProps) => {
  const router = useRouter();

  const linkMapper = (links: ILink[]) =>
    links.map(({ name, path }) => ({
      name,
      path,
      active: path === '/admin' ? router.pathname === path : router.pathname.startsWith(path),
    }));

  return (
    <Layout title="Admin Dashboard" display="row">
      <DashboardMenu logoutButton={true}>
        {ADMIN_MENUS.map(({ title, links }) => (
          <MenuGroup title={title} links={linkMapper(links)} key={uuidv4()} />
        ))}
      </DashboardMenu>

      <div className="flex flex-col flex-grow">{children}</div>
    </Layout>
  );
};

export default AdminDashboardLayout;
