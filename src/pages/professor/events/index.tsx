import type { ReactElement } from 'react';

import React from 'react';

import ProfessorDashboard from '@layout/ProfessorDashboard';
import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';

import Container from '@module/Container';
import Table from '@module/Table';

import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import TableSkeleton from '@skeleton/TableSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useLoadEvents from '@hooks/useLoadEvents';
import useLoading from '@hooks/useLoading';

import { formatDateTime } from '@util/date.utils';

import { removeEvent, selectEvents } from '@redux/eventSlice';

import useAppSelector from '@hooks/useAppSelector';

import ROLES from '@constant/roles';

const ProfessorEvents = (): ReactElement => {
  const { state: eventsState, run } = useLoadEvents();
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [run]);

  const { loading } = useLoading([eventsState, authState]);

  const events = useAppSelector(selectEvents);

  return loading || !events ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton subtitle>
        <TableSkeleton
          attributes={[
            ['ID', 'id'],
            ['Début', 'start'],
            ['Fin', 'end'],
            ['Décompte', 'countdown'],
          ]}
          action
        />
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container title="Événements" subtitle={{ name: 'Créer un événement', path: '/professor/events/create' }}>
        <Table<IEvent, keyof IEvent>
          attributes={[
            ['ID', 'id'],
            ['Début', 'start', formatDateTime],
            ['Fin', 'end', formatDateTime],
            ['Décompte', 'countdown'],
          ]}
          data={events}
          deleteAction={{ apiName: 'events', removeFromStoreReducer: removeEvent }}
        />
      </Container>
    </ProfessorDashboard>
  );
};
export default ProfessorEvents;
