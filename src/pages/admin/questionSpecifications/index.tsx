import React, { FunctionComponent } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';
import Table from '@module/Table';

interface ServerSideProps {
  specificationTypes: Array<QuestionSpecification>;
}

const AdminQuestionSpecificationDashboard: FunctionComponent<ServerSideProps> = ({ specificationTypes }: ServerSideProps) => {
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
      <Table<QuestionSpecification, keyof QuestionSpecification>
        attributes={[
          ['ID', 'id'],
          ['Nom', 'name'],
          ['Slug', 'slug'],
          ['Type de question', 'questionType', questionTypeMapper],
        ]}
        data={specificationTypes}
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

    const { data: specificationTypes } = await database.get('/api/questionSpecifications', getHeaders(token));
    if (!specificationTypes) throw new Error();

    const props: ServerSideProps = { specificationTypes };

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
