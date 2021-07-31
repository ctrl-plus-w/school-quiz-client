import React, { FunctionComponent } from 'react';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';
import Table from '@module/Table';

type ServerSideProps = {
  users: Array<User>;
  token: string;
};

const AdminUsersDashboard: FunctionComponent<ServerSideProps> = ({ users }: ServerSideProps) => {
  const genderMapper = (value: boolean | null): string => {
    if (value === null) return 'Indéfini';
    return value ? 'Homme ' : 'Femme';
  };

  return (
    <AdminDashboardModelsLayout title="Utilisateurs" subtitle="Créer un utilisateur">
      <Table<User, keyof User>
        data={users}
        attributes={[
          ['ID', 'id'],
          ["Nom d'utilisateur", 'username'],
          ['Prénom', 'firstName'],
          ['Nom de famille', 'lastName'],
          ['Genre', 'gender', genderMapper],
        ]}
      />
    </AdminDashboardModelsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const token = context.req.cookies.user;
    if (!token) throw new Error();

    const { data: validatedTokenData } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!validatedTokenData.valid) throw new Error();

    if (validatedTokenData.rolePermission !== roles.ADMIN.PERMISSION) throw new Error();

    const { data: users } = await database.get('/api/users', getHeaders(token));

    const props: ServerSideProps = { token, users };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default AdminUsersDashboard;
