import type { ReactElement } from 'react';

import React from 'react';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';

import Container from '@module/Container';
import Table from '@module/Table';

import { booleanMapper } from '@util/mapper.utils';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoadQuizzes from '@hooks/useLoadQuizzes';
import useLoading from '@hooks/useLoading';

import { removeQuiz, selectQuizzes } from '@redux/quizSlice';

import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import TableSkeleton from '@skeleton/TableSkeleton';

import ROLES from '@constant/roles';

const ProfessorQuizzes = (): ReactElement => {
  const { state: quizzesState, run } = useLoadQuizzes();
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [run]);

  const { loading } = useLoading([quizzesState, authState]);

  const quizzes = useAppSelector(selectQuizzes);

  return loading || !quizzes ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton subtitle>
        <TableSkeleton
          attributes={[
            ['ID', 'id'],
            ['Title', 'title'],
            ['Slug', 'slug'],
            ['Strict', 'strict'],
            ['Mélanger les questions', 'shuffle'],
          ]}
          action
        />
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container title="Tests" subtitle={{ name: 'Créer un test', path: '/professor/quizzes/create' }}>
        <Table<IQuiz, keyof IQuiz>
          attributes={[
            ['ID', 'id'],
            ['Title', 'title'],
            ['Slug', 'slug'],
            ['Strict', 'strict', booleanMapper],
            ['Mélanger les questions', 'shuffle', booleanMapper],
          ]}
          data={quizzes}
          deleteAction={{ apiName: 'quizzes', removeFromStoreReducer: removeQuiz }}
        />
      </Container>
    </ProfessorDashboard>
  );
};

export default ProfessorQuizzes;
