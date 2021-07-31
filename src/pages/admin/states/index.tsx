import React, { FunctionComponent } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import Table from '@module/Table';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';

interface ServerSideProps {
  states: Array<State>;
}

const AdminStatesDashboard: FunctionComponent<ServerSideProps> = ({ states }: ServerSideProps) => {
  return (
    <AdminDashboardModelsLayout active="États" title="États" subtitle="Créer un état">
      <Table<State, keyof State>
        attributes={[
          ['ID', 'id'],
          ['Nom', 'name'],
          ['Slug', 'slug'],
        ]}
        data={states}
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

    const { data: states } = await database.get('/api/states', getHeaders(token));
    if (!states) throw new Error();

    const props: ServerSideProps = { states };

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
