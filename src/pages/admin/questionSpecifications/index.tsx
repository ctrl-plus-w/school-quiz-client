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
  specificationTypes: Array<IQuestionSpecification>;
  token: string;
}

const AdminQuestionSpecificationDashboard: FunctionComponent<ServerSideProps> = ({ specificationTypes, token }: ServerSideProps) => {
  const { setToken } = useContext(AuthContext);

  useEffect(() => setToken(token), []);

  const questionTypeMapper = (questionType: 'numericQuestion' | 'textualQuestion' | 'choiceQuestion'): string => {
    switch (questionType) {
      case 'numericQuestion':
        return 'Numérique';

      case 'textualQuestion':
        return 'Textuelle';

      case 'choiceQuestion':
        return 'À choix';
    }
  };

  return (
    <AdminDashboardModelsLayout title="Spécification" subtitle="Créer un spécification">
      <Table<IQuestionSpecification, keyof IQuestionSpecification>
        attributes={[
          ['ID', 'id'],
          ['Nom', 'name'],
          ['Slug', 'slug'],
          ['Type de question', 'questionType', questionTypeMapper],
        ]}
        data={specificationTypes}
        apiName="questionSpecifications"
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

    const { data: specificationTypes } = await database.get('/api/questionSpecifications', getHeaders(token));
    if (!specificationTypes) throw new Error();

    const props: ServerSideProps = { specificationTypes, token };

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

export default AdminQuestionSpecificationDashboard;
