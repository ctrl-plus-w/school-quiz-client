import type { ReactElement } from 'react';

import React from 'react';

import StudentDashboardSkeleton from '@layout/StudentDashboardSkeleton';
import StudentDashboard from '@layout/StudentDashboard';

import Table from '@module/Table';

import Subtitle from '@element/Subtitle';
import Title from '@element/Title';

import TitleSkeleton from '@skeleton/TitleSkeleton';
import TextSkeleton from '@skeleton/TextSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoadEvents from '@hooks/useLoadEvents';
import useLoading from '@hooks/useLoading';

import { maxScoreMapper, quizTitleMapper, scoreMapper } from '@util/mapper.utils';
import { formatDateTime } from '@util/date.utils';

import { selectLoggedUser } from '@redux/authSlice';
import { selectEvents } from '@redux/eventSlice';

import ROLES from '@constant/roles';

const Student = (): ReactElement => {
  const { state: eventsState, run: runEvents } = useLoadEvents({ onNotFoundDoNothing: true });
  const { state: authState } = useAuthentication(ROLES.STUDENT.PERMISSION, [runEvents]);

  const { loading } = useLoading([authState, eventsState]);

  const user = useAppSelector(selectLoggedUser);
  const events = useAppSelector(selectEvents);

  return loading || !user ? (
    <StudentDashboardSkeleton>
      <div className="flex flex-col items-start py-12 px-12">
        <TitleSkeleton />
        <TextSkeleton width={96} className="mt-4" />
      </div>
    </StudentDashboardSkeleton>
  ) : (
    <StudentDashboard>
      <div className="flex flex-col w-full h-full py-12 px-12">
        <Title>Bienvenue, {user.firstName} !</Title>
        <Subtitle>Vous avez sur cette page les informations globales ainsi que les informations les plus importantes.</Subtitle>

        <Table<IEvent, keyof IEvent>
          attributes={[
            ['ID', 'id'],
            ['Titre', 'quiz', quizTitleMapper],
            ['Début', 'start', (start) => formatDateTime(new Date(start))],
            ['Score', 'analytics', scoreMapper],
            ['Score max', 'analytics', maxScoreMapper],
          ]}
          data={events}
          handleClick={() => null}
        />
      </div>
    </StudentDashboard>
  );
};

export default Student;
