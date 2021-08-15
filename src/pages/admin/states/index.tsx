import { FunctionComponent, useContext, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import React from 'react';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import Table from '@module/Table';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import { AuthContext } from '@authContext/AuthContext';

import ROLES from '@constant/roles';

interface ServerSideProps {
  states: Array<IState>;
  token: string;
}

const AdminStatesDashboard: FunctionComponent<ServerSideProps> = ({ states, token }: ServerSideProps) => {
  const { setToken } = useContext(AuthContext);

  useEffect(() => setToken(token), []);

  return (
    <AdminDashboardModelsLayout title="États" subtitle="Créer un état">
      <Table<IState, keyof IState>
        attributes={[
          ['ID', 'id'],
          ['Nom', 'name'],
          ['Slug', 'slug'],
        ]}
        data={states}
        apiName="states"
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

    const { data: states } = await database.get('/api/states', getHeaders(token));
    if (!states) throw new Error();

    const props: ServerSideProps = { states, token };

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

export default AdminStatesDashboard;
