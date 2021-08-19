import { useSelector } from 'react-redux';

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

import { formatDateTime } from '@util/date.utils';

import { removeEvent, selectEvents } from '@redux/eventSlice';

import ROLES from '@constant/roles';

const ProfessorEvents = (): ReactElement => {
  const { state: eventsState, run } = useLoadEvents();
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [run]);

  const events = useSelector(selectEvents);

  return eventsState === 'LOADING' || authState === 'LOADING' ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton subtitle>
        <TableSkeleton
          attributes={[
            ['ID', 'id'],
            ['Début', 'start'],
            ['Fin', 'end'],
            ['Décompte', 'countdown'],
          ]}
        />
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container title="Événements" subtitle={{ name: 'Créer un événement', path: '/professor/events/create' }}>
        <Table<IEvent, keyof IEvent>
          apiName="events"
          attributes={[
            ['ID', 'id'],
            ['Début', 'start', formatDateTime],
            ['Fin', 'end', formatDateTime],
            ['Décompte', 'countdown'],
          ]}
          data={events || []}
          removeFromStore={removeEvent}
        />
      </Container>
    </ProfessorDashboard>
  );
};
export default ProfessorEvents;
