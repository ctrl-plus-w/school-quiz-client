import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FunctionComponent, useContext, useEffect } from 'react';

import React from 'react';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import Table from '@module/Table';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import { AuthContext } from '@authContext/AuthContext';

import ROLES from '@constant/roles';

type ServerSideProps = {
  groups: Array<IGroup>;
  token: string;
};

const AdminGroupsDashboard: FunctionComponent<ServerSideProps> = ({ groups, token }: ServerSideProps) => {
  const { setToken } = useContext(AuthContext);

  useEffect(() => setToken(token), []);

  return (
    <AdminDashboardModelsLayout title="Groupes" subtitle="Créer un groupe">
      <Table<IGroup, keyof IGroup>
        data={groups}
        attributes={[
          ['ID', 'id'],
          ['Nom', 'name'],
          ['Slug', 'slug'],
        ]}
        apiName="groups"
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

    const { data: groups } = await database.get('/api/groups', getHeaders(token));

    const props: ServerSideProps = { groups, token };

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
