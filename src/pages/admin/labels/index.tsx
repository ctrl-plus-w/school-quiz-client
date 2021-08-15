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
  labels: Array<ILabel>;
  token: string;
}

const AdminLabelsDashboard: FunctionComponent<ServerSideProps> = ({ labels, token }: ServerSideProps) => {
  const { setToken } = useContext(AuthContext);

  useEffect(() => setToken(token), []);

  return (
    <AdminDashboardModelsLayout title="Labels" subtitle="Créer un label">
      <Table<ILabel, keyof ILabel>
        attributes={[
          ['ID', 'id'],
          ['Nom', 'name'],
          ['Slug', 'slug'],
        ]}
        data={labels}
        apiName="labels"
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

    const { data: labels } = await database.get('/api/labels', getHeaders(token));
    if (!labels) throw new Error();

    const props: ServerSideProps = { labels, token };

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

export default AdminLabelsDashboard;
