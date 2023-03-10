import { useRouter } from 'next/router';
import { useState } from 'react';

import type { FormEvent, ReactElement } from 'react';

import React from 'react';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import Container from '@module/Container';
import FormGroup from '@module/FormGroup';
import Form from '@module/Form';
import Row from '@module/Row';

import CalendarInput from '@element/CalendarInput';
import TimeInput from '@element/TimeInput';
import Dropdown from '@element/Dropdown';
import Title from '@element/Title';

import FormButtonsSkeleton from '@skeleton/FormButtonsSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoadQuizzes from '@hooks/useLoadQuizzes';
import useLoadGroups from '@hooks/useLoadGroups';
import useValidation from '@hooks/useValidation';
import useLoading from '@hooks/useLoading';

import { incrementHours, incrementMinutes, setTime } from '@util/date.utils';

import { createEvent } from '@api/events';

import { selectQuizzes } from '@redux/quizSlice';
import { selectGroups } from '@redux/groupSlice';
import { selectToken } from '@redux/authSlice';

import useAppDispatch from '@hooks/useAppDispatch';

import { addErrorNotification, addSuccessNotification } from '@redux/notificationSlice';

import ROLES from '@constant/roles';

const CreateEvent = (): ReactElement => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { state: quizState, run: runQuizzes } = useLoadQuizzes();
  const { state: groupState, run: runGroups } = useLoadGroups();
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runGroups, runQuizzes]);

  const { loading } = useLoading([quizState, authState, groupState]);

  const token = useAppSelector(selectToken);
  const groups = useAppSelector(selectGroups);
  const quizzes = useAppSelector(selectQuizzes);

  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState<[string, string]>(['10', '00']);
  const [duration, setDuration] = useState<[string, string]>(['01', '00']);
  const [group, setGroup] = useState('');
  const [quiz, setQuiz] = useState('');

  const { valid } = useValidation(
    () => {
      if (/* areDatesEquals(date, new Date()) ||*/ setTime(date, 0, 0, 0).valueOf() <= new Date().valueOf()) return false;

      if (parseInt(start[0]) === 0 && parseInt(start[1]) === 0) return false;
      if (parseInt(duration[0]) === 0 && parseInt(duration[1]) === 0) return false;

      return true;
    },
    [date, start, duration, group, quiz],
    [group, quiz]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!valid || !token) return;

    const startDate = setTime(date, parseInt(start[0]), parseInt(start[1]));
    const endDate = incrementMinutes(incrementHours(startDate, parseInt(duration[0])), parseInt(duration[1]));

    const groupId = groups.find(({ slug }) => slug === group)?.id;
    const quizId = quizzes.find(({ slug }) => slug === quiz)?.id;

    if (!groupId || !quizId) return;

    const creationAttributes: EventCreationAttributes = {
      start: startDate,
      end: endDate,
      countdown: 60 * 10 * 1000,
      groupId: groupId,
      quizId: quizId,
    };

    const [event, error] = await createEvent(creationAttributes, token);

    if (error) {
      if (error.status === 403) router.push('/login');
      else dispatch(addErrorNotification(error.message));
    }

    if (!event) return;

    dispatch(addSuccessNotification('Événement créé.'));
    router.push(`/professor/events`);
  };

  return loading || !groups || !quizzes ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <hr className="mt-8 mb-8" />

        <FormSkeleton full>
          <FormGroupSkeleton>
            <TitleSkeleton />

            <InputSkeleton />
            <InputSkeleton />
            <InputSkeleton />

            <Row className="w-80">
              <InputSkeleton small />
              <InputSkeleton small />
            </Row>
          </FormGroupSkeleton>

          <FormButtonsSkeleton />
        </FormSkeleton>
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container title="Créer un événement" breadcrumb={[{ name: 'Événements', path: '/professor/events' }, { name: 'Créer un événement' }]}>
        <hr className="mt-8 mb-8" />

        <Form onSubmit={handleSubmit} full>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Dropdown
              label="Quiz"
              placeholder="Aucun quiz sélectionné"
              values={quizzes.map(({ title, slug }) => ({ name: title, slug }))}
              value={quiz}
              setValue={setQuiz}
            />

            <Dropdown label="Groupe" placeholder="Aucun groupe sélectionné" values={groups} value={group} setValue={setGroup} />

            <CalendarInput label="Date" value={date} setValue={setDate} onlyFuture />

            <Row className="w-80">
              <TimeInput label="Début" value={start} setValue={setStart} />

              <TimeInput label="Durée" value={duration} setValue={setDuration} />
            </Row>
          </FormGroup>

          <FormButtons href="/professor/events" valid={valid} />
        </Form>
      </Container>
    </ProfessorDashboard>
  );
};

export default CreateEvent;
