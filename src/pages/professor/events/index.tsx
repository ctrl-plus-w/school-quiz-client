import React, { ReactElement, useContext, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import Container from '@module/Container';
import Table from '@module/Table';

import { getHeaders } from '@util/authentication.utils';

import ROLES from '@constant/roles';

import { AuthContext } from 'context/AuthContext/AuthContext';

import database from 'database/database';

interface IServerSideProps {
  events: Array<IEvent>;
  token: string;
}

const ProfessorEvents = ({ events, token }: IServerSideProps): ReactElement => {
  const { setToken } = useContext(AuthContext);

  useEffect(() => setToken(token), []);

  return (
    <ProfessorDashboard>
      <Container title="Événements" subtitle="Créer un événement">
        <Table<IEvent, keyof IEvent> apiName="events" attributes={[['ID', 'id']]} data={events} />
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

    const { data: events } = await database.get(`/api/events`, { ...getHeaders(token), params: { userId: data.userId } });
    if (!events) throw new Error();

    const props: IServerSideProps = { events, token };

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

export default ProfessorEvents;
