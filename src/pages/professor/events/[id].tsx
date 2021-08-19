import { FormEvent, ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import React from 'react';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import FormGroup from '@module/FormGroup';
import Container from '@module/Container';
import Form from '@module/Form';
import Row from '@module/Row';

import CalendarInput from '@element/CalendarInput';
import TimeInput from '@element/TimeInput';
import Dropdown from '@element/Dropdown';
import Title from '@element/Title';
import Bar from '@element/Bar';

import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useLoadQuizzes from '@hooks/useLoadQuizzes';
import useAppSelector from '@hooks/useAppSelector';
import useLoadGroups from '@hooks/useLoadGroups';
import useLoadEvent from '@hooks/useLoadEvent';
import useLoading from '@hooks/useLoading';
import useSwitch from '@hooks/useSwitch';

import { getTimeArrayFromDifference, getTimeAsArray } from '@util/date.utils';
import { collaboratorsMapper } from '@util/mapper.utils';

import { selectTempEvent } from '@redux/eventSlice';
import { selectGroups } from '@redux/groupSlice';
import { selectQuizzes } from '@redux/quizSlice';

import ROLES from '@constant/roles';

const Event = (): ReactElement => {
  const router = useRouter();

  const { id } = router.query;

  const { state: quizState, run: runQuizzes } = useLoadQuizzes();
  const { state: groupState, run: runGroups } = useLoadGroups();
  const { state: eventState, run: runEvents } = useLoadEvent(parseInt(id as string));
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runEvents, runGroups, runQuizzes]);

  const { loading } = useLoading([authState, eventState, groupState, quizState]);

  const event = useAppSelector(selectTempEvent);
  const groups = useAppSelector(selectGroups);
  const quizzes = useAppSelector(selectQuizzes);

  const [valid, _setValid] = useState(false);
  const [formFilled, setFormFilled] = useState(false);

  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState<[string, string]>(['0', '0']);
  const [duration, setDuration] = useState<[string, string]>(['0', '0']);

  const [group, setGroup] = useState('');
  const [quiz, setQuiz] = useState('');
  const [_collaborators, setCollaborators] = useState<Array<IBasicModel>>([]);

  useEffect(() => {
    if (!event) return;

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    const eventGroup = event.group;
    const eventQuiz = event.quiz;

    setDate(startDate);
    setStart(getTimeAsArray(startDate));
    setDuration(getTimeArrayFromDifference(startDate, endDate));

    setCollaborators(event.collaborators.map(collaboratorsMapper));

    eventGroup && setGroup(eventGroup.slug);
    eventQuiz && setQuiz(eventQuiz.slug);

    setFormFilled(true);
  }, [event]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!valid) return;

    alert();
  };

  const value = useSwitch('p');

  return loading || !formFilled || value ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <Bar />

        <FormSkeleton full>
          <FormGroupSkeleton>
            <TitleSkeleton level={2} />
          </FormGroupSkeleton>
        </FormSkeleton>
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container title="Modifier un quiz" breadcrumb={[{ name: 'Événement', path: '/professor/events' }, { name: 'Modifier un événement' }]}>
        <Bar />

        <Form onSubmit={handleSubmit} full>
          <Row wrap>
            <FormGroup>
              <Title level={2}>Informations générales</Title>

              <Dropdown
                label="Quiz"
                placeholder="Aucun quiz sélectionné"
                values={quizzes.map(({ title, slug }) => ({ name: title, slug }))}
                value={quiz}
                setValue={setQuiz}
                readonly
              />

              <Dropdown label="Groupe" placeholder="Aucun groupe sélectionné" values={groups} value={group} setValue={setGroup} readonly />

              <CalendarInput label="Date" value={date} setValue={setDate} />

              <Row className="w-80">
                <TimeInput label="Début" value={start} setValue={setStart} />

                <TimeInput label="Durée" value={duration} setValue={setDuration} />
              </Row>
            </FormGroup>

            <FormGroup>
              <Title level={2}>Utilisateurs</Title>

              {/* TODO : Make the collaborators. */}
            </FormGroup>
          </Row>

          <FormButtons href="/professor/events" valid={valid} />
        </Form>
      </Container>
    </ProfessorDashboard>
  );
};

export default Event;
