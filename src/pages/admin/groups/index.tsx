import React, { FunctionComponent } from 'react';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';
import Table from '@module/Table';

type ServerSideProps = {
  groups: Array<Group>;
};

const AdminGroupsDashboard: FunctionComponent<ServerSideProps> = ({ groups }: ServerSideProps) => {
  return (
    <AdminDashboardModelsLayout  title="Groupes" subtitle="Créer un groupe">
      <Table
        data={groups}
        attributes={[
          ['ID', 'id'],
          ['Nom', 'name'],
          ['Slug', 'slug'],
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

    const { data: groups } = await database.get('/api/groups', getHeaders(token));

    const props: ServerSideProps = { groups };

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

export default AdminGroupsDashboard;
