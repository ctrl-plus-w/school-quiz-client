import { ReactElement, useEffect } from 'react';

import React from 'react';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ProfessorDashboardLayout from '@layout/ProfessorDashboard';

import Container from '@module/Container';
import Table from '@module/Table';

import useLoadProfessorEvent from '@hooks/useLoadProfessorEvent';
import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoading from '@hooks/useLoading';
import useSocket from '@hooks/useSocket';

import { addUsers, clearUsers, replaceOrAddUser, selectUsers } from '@redux/userSlice';
import { selectTempQuiz, setTempQuiz } from '@redux/quizSlice';
import { selectTempEvent } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';

import ROLES from '@constant/roles';

const Direct = (): ReactElement => {
  const dispatch = useAppDispatch();

  const { state: eventState, run: runEvent } = useLoadProfessorEvent();
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runEvent]);

  const { loading } = useLoading([authState, eventState]);

  const token = useAppSelector(selectToken);
  const event = useAppSelector(selectTempEvent);
  const quiz = useAppSelector(selectTempQuiz);
  const users = useAppSelector(selectUsers);

  const socket = useSocket(token);

  useEffect(() => {
    if (!event) return;

    dispatch(clearUsers());

    if (event.quiz) dispatch(setTempQuiz(event.quiz));
    if (event.users) dispatch(addUsers(event.users));
  }, [event]);

  const stateMapper = (state?: IState): ReactElement => {
    if (state && state.slug === 'actif') return <span className="bg-green-600 text-white py-1 px-4 rounded">{state.name}</span>;
    if (state && state.slug === 'pret') return <span className="bg-yellow-600 text-white py-1 px-4 rounded">{state.name}</span>;

    return <span className="bg-red-600 text-white py-1 px-4 rounded">{'Inactif'}</span>;
  };

  useEffect(() => {
    if (!socket || !event) return;

    socket.emit('user:join');

    socket.on('user:update', (user: IUser) => {
      dispatch(replaceOrAddUser(user));
    });
  }, [socket, event]);

  if (loading) return <ProfessorDashboardSkeleton></ProfessorDashboardSkeleton>;

  if (!event || !quiz)
    return (
      <ProfessorDashboardLayout>
        <div className="flex flex-col m-auto">
          <h1>Aucun événement trouvé.</h1>
        </div>
      </ProfessorDashboardLayout>
    );

  return (
    <ProfessorDashboardLayout>
      <Container title="Test en direct" subtitle={quiz.title}>
        <Table
          data={users}
          attributes={[
            ["Nom d'utilisateur", 'username'],
            ['Nom', 'lastName'],
            ['État', 'state', stateMapper],
          ]}
          handleClick={() => null}
        />
      </Container>
    </ProfessorDashboardLayout>
  );
};

export default Direct;
