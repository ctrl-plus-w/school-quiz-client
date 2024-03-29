import { FormEvent, ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import React from 'react';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import FormGroup from '@module/FormGroup';
import Container from '@module/Container';
import Table from '@module/Table';
import Form from '@module/Form';
import Row from '@module/Row';

import CalendarInput from '@element/CalendarInput';
import SearchInput from '@element/SearchInput';
import TimeInput from '@element/TimeInput';
import Dropdown from '@element/Dropdown';
import Subtitle from '@element/Subtitle';
import Title from '@element/Title';
import Bar from '@element/Bar';

import FormButtonsSkeleton from '@skeleton/FormButtonsSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';

import useLoadQuestionsToCorrect from '@hooks/useLoadQuestionsToCorrect';
import useAuthentication from '@hooks/useAuthentication';
import useLoadQuizzes from '@hooks/useLoadQuizzes';
import useAppSelector from '@hooks/useAppSelector';
import useValidation from '@hooks/useValidation';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoadGroups from '@hooks/useLoadGroups';
import useLoadUsers from '@hooks/useLoadUsers';
import useLoadEvent from '@hooks/useLoadEvent';
import useLoading from '@hooks/useLoading';

import {
  getTimeArrayFromDifference,
  getTimeAsArray,
  incrementDate,
  incrementTime,
  isInFuture,
  isSameDate,
  isSameDateTime,
  isSameTime,
  setTime,
} from '@util/date.utils';
import { collaboratorsMapper, eventEndedAtMapper, eventStartedAtMapper, questionTypeMapper, slugMapper, sortById } from '@util/mapper.utils';
import { scoreMapper, maxScoreMapper } from '@util/mapper.utils';
import { areArraysEquals } from '@util/condition.utils';
import { getLength } from '@util/object.utils';

import { addCollaborators, removeCollaborators, updateEvent } from '@api/events';

import { addErrorNotification, addSuccessNotification } from '@redux/notificationSlice';
import { selectLoggedUser, selectToken } from '@redux/authSlice';
import { selectProfessors } from '@redux/userSlice';
import { selectQuestions } from '@redux/questionSlice';
import { selectTempEvent } from '@redux/eventSlice';
import { selectQuizzes } from '@redux/quizSlice';
import { selectGroups } from '@redux/groupSlice';

import ROLES from '@constant/roles';

const Event = (): ReactElement => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { id } = router.query;

  const { state: quizState, run: runQuizzes } = useLoadQuizzes();
  const { state: groupState, run: runGroups } = useLoadGroups();
  const { state: userState, run: runUsers } = useLoadUsers('professeur');
  const { state: questionState, run: runQuestions } = useLoadQuestionsToCorrect(parseInt(id as string));
  const { state: eventState, run: runEvents } = useLoadEvent(parseInt(id as string));
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runEvents, runGroups, runQuizzes, runUsers, runQuestions]);

  const { loading } = useLoading([authState, eventState, groupState, quizState, userState, questionState]);

  const user = useAppSelector(selectLoggedUser);
  const token = useAppSelector(selectToken);
  const event = useAppSelector(selectTempEvent);
  const groups = useAppSelector(selectGroups);
  const quizzes = useAppSelector(selectQuizzes);
  const professors = useAppSelector(selectProfessors);
  const questions = useAppSelector(selectQuestions);

  const [formFilled, setFormFilled] = useState(false);

  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState<[string, string]>(['0', '0']);
  const [duration, setDuration] = useState<[string, string]>(['0', '0']);

  const [group, setGroup] = useState('');
  const [quiz, setQuiz] = useState('');
  const [collaborators, setCollaborators] = useState<Array<IBasicModel>>([]);

  const [isNoMoreEditable] = useState(!isInFuture(new Date(event?.start || Date.now())));
  const [isOwner, setIsOwner] = useState(false);

  const { valid } = useValidation(
    () => {
      if (!event) return false;

      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      // ? const eventGroup = event.group;
      // ? const eventQuiz = event.quiz;

      // Check if the start isn't in the pas
      if (setTime(date, parseInt(duration[0]), parseInt(duration[1])).valueOf() < incrementDate(new Date(), -1).valueOf()) return false;

      // Check if start date is different
      if (!isSameDate(startDate, date)) return true;

      // Check if start time and end time are differents
      if (!areArraysEquals(start, getTimeAsArray(startDate), () => 0)) return true;

      if (!isSameTime(endDate, incrementTime(startDate, parseInt(duration[0]), parseInt(duration[1])))) return true;

      // ? if (!eventGroup || group !== eventGroup.slug) return true;
      // ? if (!eventQuiz || quiz !== eventQuiz.slug) return true;

      if (!areArraysEquals(collaborators.map(slugMapper), event.collaborators.map(collaboratorsMapper).map(slugMapper))) return true;

      return false;
    },
    [date, start, duration, group, quiz, collaborators],
    [group, quiz]
  );

  useEffect(() => {
    if (!event || !user) return;

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

    setIsOwner(event.owner.id === user.id);

    setFormFilled(true);
  }, [event, user]);

  const handleQuestionRedirect = (instance: Question) => {
    router.push({ pathname: `${router.pathname}/questions/${instance.id}`, query: { id: instance.id } });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!valid || !event || !token) return;

    const startDate = setTime(date, parseInt(start[0]), parseInt(start[1]));
    const endDate = incrementTime(startDate, parseInt(duration[0]), parseInt(duration[1]));

    const updateAttributes: AllOptional<EventCreationAttributes> = {
      start: !isSameDateTime(new Date(event?.start), startDate) ? startDate : undefined,
      end: !isSameDateTime(new Date(event?.end), endDate) ? endDate : undefined,
    };

    if (getLength(updateAttributes) > 0) {
      const [updatedEvent, updateEventError] = await updateEvent(event.id, updateAttributes, token);

      if (updateEventError) {
        if (updateEventError.status === 403) router.push('/login');
        else dispatch(addErrorNotification(updateEventError.message));
      }

      if (!updatedEvent) return;
    }

    if (!areArraysEquals(collaborators.map(slugMapper), event.collaborators.map(collaboratorsMapper).map(slugMapper))) {
      const newCollaborators = collaborators.filter(({ slug }) => !event.collaborators.some(({ id }) => id.toString() === slug));
      const oldCollaborators = event.collaborators.filter(({ id }) => !collaborators.some(({ slug }) => id.toString() === slug));

      if (newCollaborators.length > 0) {
        const ids = newCollaborators.map(slugMapper).map((id) => parseInt(id));

        const [added, error] = await addCollaborators(event.id, ids, token);

        if (error) {
          if (error.status === 403) router.push('/login');
          else dispatch(addErrorNotification(error.message));
        }

        if (!added) return;
      }

      if (oldCollaborators.length > 0) {
        const ids = oldCollaborators.map(({ id }) => id);

        const [removed, error] = await removeCollaborators(event.id, ids, token);

        if (error) {
          if (error.status === 403) router.push('/login');
          else dispatch(addErrorNotification(error.message));
        }

        if (!removed) return;
      }
    }

    dispatch(addSuccessNotification('Événement modifié.'));
    router.push('/professor/events');
  };

  return loading || !formFilled || !event ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <Bar />

        <FormSkeleton full>
          <Row wrap>
            <FormGroupSkeleton>
              <TitleSkeleton level={2} />

              <InputSkeleton />
              <InputSkeleton />
              <InputSkeleton />

              <Row>
                <InputSkeleton />
                <InputSkeleton />
              </Row>
            </FormGroupSkeleton>

            <FormGroupSkeleton>
              <TitleSkeleton level={2} />

              <InputSkeleton />
            </FormGroupSkeleton>
          </Row>

          <FormButtonsSkeleton />
        </FormSkeleton>
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container
        title="Modifier un quiz"
        breadcrumb={[{ name: 'Événement', path: '/professor/events' }, { name: 'Modifier un événement' }]}
        badge={{ content: isOwner ? 'Propriétaire' : 'Collaborateur', type: 'INFO' }}
      >
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

              <CalendarInput label="Date" value={date} setValue={setDate} readonly={!isOwner || isNoMoreEditable} onlyFuture />

              <Row className="w-80">
                <TimeInput label="Début" value={start} setValue={setStart} readonly={!isOwner || isNoMoreEditable} />

                <TimeInput label="Durée" value={duration} setValue={setDuration} readonly={!isOwner || isNoMoreEditable} />
              </Row>
            </FormGroup>

            <FormGroup>
              <Title level={2}>Utilisateurs</Title>

              <SearchInput
                label="Collaborateurs"
                data={professors.map(collaboratorsMapper)}
                values={collaborators}
                setValues={setCollaborators}
                disabled={!isOwner || isNoMoreEditable}
              />
            </FormGroup>
          </Row>

          {isOwner && !isNoMoreEditable && <FormButtons href="/professor/events" valid={valid} update />}
        </Form>

        <div className="flex flex-col items-start min-h-full mt-16">
          <Title level={2}>Élèves.</Title>
          <Subtitle>Liste des élèves.</Subtitle>

          <Table<IUser, keyof IUser>
            attributes={[
              ['ID', 'id'],
              ['Prénom', 'firstName'],
              ['Nom', 'lastName'],
              ['Score', 'analytics', scoreMapper],
              ['Score max', 'analytics', maxScoreMapper],
              ['Début', 'analytics', eventStartedAtMapper],
              ['Fin', 'analytics', eventEndedAtMapper],
            ]}
            data={sortById(event?.users || [])}
            handleClick={() => null}
          />
        </div>

        <div className="flex flex-col items-start min-h-full mt-16">
          <Title level={2}>Questions à vérifier</Title>
          <Subtitle>Voici les question dont vous devez vérifier la validitée.</Subtitle>

          <Table<Question, keyof Question>
            attributes={[
              ['ID', 'id'],
              ['Titre', 'title'],
              ['Description', 'description'],
              ['Début', 'questionType', questionTypeMapper],
            ]}
            data={questions}
            handleClick={handleQuestionRedirect}
          />
        </div>
      </Container>
    </ProfessorDashboard>
  );
};

export default Event;
