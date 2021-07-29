import React from 'react';

import { GetServerSideProps } from 'next';

import Layout from '@layout/Default';

import Menu from '@module/Menu';

import { getServerSidePropsAdminFunction } from '@util/authentication.utils';
import MenuGroup from '@element/MenuGroup';

interface IProps {}

const menus: Array<IMenu> = [
  {
    title: 'Général',

    links: [
      { name: 'Accueil', path: '/admin', active: true },
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

const AdminDashboard = ({}: IProps) => {
  return (
    <Layout title="Admin Dashboard" display="row">
      <Menu logoutButton={true}>
        {menus.map(({ title, links }) => (
          <MenuGroup title={title} links={links} />
        ))}
      </Menu>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = getServerSidePropsAdminFunction;

export default AdminDashboard;
