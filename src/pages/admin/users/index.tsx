import { FunctionComponent, useContext, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import React from 'react';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import Table from '@module/Table';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import { AuthContext } from '@authContext/AuthContext';

import ROLES from '@constant/roles';

type ServerSideProps = {
  users: Array<IUser>;
  token: string;
};

const AdminUsersDashboard: FunctionComponent<ServerSideProps> = ({ users, token }: ServerSideProps) => {
  const { setToken } = useContext(AuthContext);

  useEffect(() => setToken(token), []);

  const genderMapper = (value: boolean | null): string => {
    if (value === null) return 'Indéfini';
    return value ? 'Homme ' : 'Femme';
  };

  return (
    <AdminDashboardModelsLayout title="Utilisateurs" subtitle="Créer un utilisateur">
      <Table<IUser, keyof IUser>
        data={users}
        attributes={[
          ['ID', 'id'],
          ["Nom d'utilisateur", 'username'],
          ['Prénom', 'firstName'],
          ['Nom de famille', 'lastName'],
          ['Genre', 'gender', genderMapper],
        ]}
        apiName="users"
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

    if (validatedTokenData.rolePermission !== ROLES.ADMIN.PERMISSION) throw new Error();

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
