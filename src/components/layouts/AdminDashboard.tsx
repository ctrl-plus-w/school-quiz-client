import React, { FunctionComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Layout from '@layout/Default';

import Menu from '@module/Menu';

import MenuGroup from '@element/MenuGroup';

interface IProps {
  children?: React.ReactNode;
  active: string;
}

const menus: Array<IMenu> = [
  {
    title: 'Général',

    links: [
      { name: 'Accueil', path: '/admin' },
      { name: 'Utilisateurs', path: '/admin/users' },
      { name: 'Groupes', path: '/admin/groups' },
    ],
  },
  {
    title: 'Paramètres',

    links: [
      { name: 'Site', path: '/admin/website' },
      { name: 'Profile', path: '/admin/profile' },
    ],
  },
];

const AdminDashboardLayout: FunctionComponent<IProps> = ({ children, active }: IProps) => {
  const linkMapper = (links: ILink[]) =>
    links.map(({ name, path }) => ({
      name,
      path,
      active: name === active ? true : false,
    }));

  return (
    <Layout title="Admin Dashboard" display="row">
      <Menu logoutButton={true}>
        {menus.map(({ title, links }) => (
          <MenuGroup title={title} links={linkMapper(links)} key={uuidv4()} />
        ))}
      </Menu>

      <div className="flex flex-col flex-grow">{children}</div>
    </Layout>
  );
};

export default AdminDashboardLayout;
