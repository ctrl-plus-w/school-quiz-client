import React, { ReactElement, useContext, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import Container from '@module/Container';
import Table from '@module/Table';

import { getHeaders } from '@util/authentication.utils';

import { booleanMapper } from '@util/mapper.utils';

import ROLES from '@constant/roles';

import { AuthContext } from 'context/AuthContext/AuthContext';

import database from 'database/database';

interface IServerSideProps {
  quizzes: Array<IQuiz>;
  token: string;
}

const ProfessorQuizzes = ({ quizzes, token }: IServerSideProps): ReactElement => {
  const { setToken } = useContext(AuthContext);

  useEffect(() => setToken(token), []);

  return (
    <ProfessorDashboard>
      <Container title="Tests" subtitle={{ name: 'Créer un test', path: '/professor/quizzes/create' }}>
        <Table<IQuiz, keyof IQuiz>
          apiName="quizzes"
          attributes={[
            ['ID', 'id'],
            ['Title', 'title'],
            ['Slug', 'slug'],
            ['Strict', 'strict', booleanMapper],
            ['Mélanger les questions', 'shuffle', booleanMapper],
          ]}
          data={quizzes}
        />
      </Container>
    </ProfessorDashboard>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const token = context.req.cookies.user;
    if (!token) throw new Error();

    const { data } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!data.valid) throw new Error();

    if (data.rolePermission !== ROLES.PROFESSOR.PERMISSION) throw new Error();

    const { data: quizzes } = await database.get(`/api/quizzes`, { ...getHeaders(token), params: { userId: data.userId } });
    if (!quizzes) throw new Error();

    const props: IServerSideProps = { quizzes, token };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

export default ProfessorQuizzes;
