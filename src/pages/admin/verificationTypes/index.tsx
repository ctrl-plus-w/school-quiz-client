import React, { FunctionComponent, useContext, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';
import Table from '@module/Table';
import { AuthContext } from 'context/AuthContext/AuthContext';

interface ServerSideProps {
  verificationTypes: Array<IVerificationType>;
  token: string;
}

const AdminVerificationTypesDashboard: FunctionComponent<ServerSideProps> = ({ verificationTypes, token }: ServerSideProps) => {
  const { setToken } = useContext(AuthContext);

  useEffect(() => setToken(token), []);

  return (
    <AdminDashboardModelsLayout title="Vérification" subtitle="Créer un type de vérification">
      <Table<IVerificationType, keyof IVerificationType>
        attributes={[
          ['ID', 'id'],
          ['Nom', 'name'],
          ['Slug', 'slug'],
        ]}
        data={verificationTypes}
        apiName="verificationTypes"
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

    const { data: verificationTypes } = await database.get('/api/verificationTypes', getHeaders(token));
    if (!verificationTypes) throw new Error();

    const props: ServerSideProps = { verificationTypes, token };

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

export default AdminVerificationTypesDashboard;
