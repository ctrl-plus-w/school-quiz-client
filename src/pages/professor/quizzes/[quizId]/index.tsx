import React from 'react';

import { FormEvent, ReactElement, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import FormGroup from '@module/FormGroup';
import Container from '@module/Container';
import Table from '@module/Table';
import Form from '@module/Form';
import Row from '@module/Row';

import CheckboxInput from '@element/CheckboxInput';
import SearchInput from '@element/SearchInput';
import Textarea from '@element/Textarea';
import Input from '@element/Input';
import Title from '@element/Title';
import Route from '@element/Route';

import { isNull, questionTypeMapper, quizCollaboratorsMapper, slugMapper } from '@util/mapper.utils';
import { areArraysEquals, isOneLoading } from '@util/condition.utils';
import { getLength } from '@util/object.utils';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoadUsers from '@hooks/useLoadUsers';
import useLoadQuiz from '@hooks/useLoadQuiz';

import { addCollaborators, removeCollaborators, updateQuiz } from '@api/quizzes';

import { NotificationContext } from '@notificationContext/NotificationContext';

import { selectProfessors } from '@redux/userSlice';
import { selectTempQuiz } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';

import ROLES from '@constant/roles';
import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import CheckboxInputSkeleton from '@skeleton/CheckboxInputSkeleton';
import FormButtonsSkeleton from '@skeleton/FormButtonsSkeleton';
import TextSkeleton from '@skeleton/TextSkeleton';
import TableSkeleton from '@skeleton/TableSkeleton';

const Quiz = (): ReactElement => {
  const router = useRouter();

  const { quizId } = router.query;

  const { state: usersState, run: runUsers } = useLoadUsers('professeur');
  const { state: quizState, run: runQuizzes } = useLoadQuiz(parseInt(quizId as string), { notFoundRedirect: '/professor/quizzes' });
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runQuizzes, runUsers]);

  const quiz = useAppSelector(selectTempQuiz);
  const token = useAppSelector(selectToken);
  const professors = useAppSelector(selectProfessors);

  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [formFilled, setFormFilled] = useState(false);
  const [valid, setValid] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [strict, setStrict] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const [quizCollaborators, setQuizCollaborators] = useState<Array<IBasicModel>>([]);
  const [collaborators, setCollaborators] = useState<Array<IBasicModel>>([]);

  // When the quiz get loaded, set the state values.
  useEffect(() => {
    if (!quiz) return;

    setTitle(quiz.title);
    setDescription(quiz.description);
    setStrict(quiz.strict);
    setShuffle(quiz.shuffle);

    setQuizCollaborators(quiz.collaborators.map(quizCollaboratorsMapper));
    setCollaborators(quiz.collaborators.map(quizCollaboratorsMapper));

    setFormFilled(true);
  }, [quiz]);

  // Check the validity of the form.
  useEffect(() => {
    const isValid = (): boolean => {
      if (!quiz) return false;

      if (
        title !== quiz.title ||
        description !== quiz.description ||
        strict !== quiz.strict ||
        shuffle !== quiz.shuffle ||
        !areArraysEquals(collaborators, quizCollaborators)
      )
        return true;

      return false;
    };

    if (isValid()) setValid(true);
    else setValid(false);
  }, [title, description, strict, shuffle, collaborators]);

  // Check some data is getting fetched and if the fetched data is not null.
  useEffect(() => {
    setLoading(isOneLoading([authState, quizState, usersState]) && isNull(quiz) && !formFilled);
  }, [authState, quizState, usersState, formFilled]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid || !quiz || !token) return;

    const updateAttributes: AllOptional<QuizCreationAttributes> = {
      title: title !== quiz.title ? title : undefined,
      description: description !== quiz.description ? description : undefined,
      shuffle: shuffle !== quiz.shuffle ? shuffle : undefined,
      strict: strict !== quiz.strict ? strict : undefined,
    };

    if (getLength(updateAttributes) > 0) {
      const [updatedQuiz, updateQuizError] = await updateQuiz(quiz.id, updateAttributes, token);

      if (updateQuizError) {
        if (updateQuizError.status === 403) router.push('/login');
        else addNotification({ content: updateQuizError.message, type: 'ERROR' });
      }

      if (!updatedQuiz) return;
    }

    if (!areArraysEquals(collaborators, quizCollaborators)) {
      const newCollaborators = collaborators.filter(({ slug }) => !quizCollaborators.some(({ slug: _slug }) => slug === _slug));
      const oldCollaborators = quizCollaborators.filter(({ slug }) => !collaborators.some(({ slug: _slug }) => slug === _slug));

      if (newCollaborators.length > 0) {
        const ids = newCollaborators.map(slugMapper).map((id) => parseInt(id));

        const [added, addCollaboratorsError] = await addCollaborators(quiz.id, ids, token);

        if (addCollaboratorsError) {
          if (addCollaboratorsError.status === 403) router.push('/login');
          else addNotification({ content: addCollaboratorsError.message, type: 'ERROR' });
        }

        if (!added) return;
      }

      if (oldCollaborators.length > 0) {
        const ids = oldCollaborators.map(slugMapper).map((id) => parseInt(id));

        const [removed, removeCollaboratorsError] = await removeCollaborators(quiz.id, ids, token);

        if (removeCollaboratorsError) {
          if (removeCollaboratorsError.status === 403) router.push('/login');
          else addNotification({ content: removeCollaboratorsError.message, type: 'ERROR' });
        }

        if (!removed) return;
      }
    }

    addNotification({ content: 'Quiz modifiée.', type: 'INFO' });
    router.push(`/professor/quizzes`);
  };

  const handleClick = (instance: Question) => {
    if (quiz) router.push({ pathname: `${router.pathname}/questions/[questionId]`, query: { quizId: quiz.id, questionId: instance.id } });
    else router.push('/professor/quizzes');
  };

  return loading ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <hr className="mb-8 mt-8" />

        <FormSkeleton full>
          <Row wrap>
            <FormGroupSkeleton className="mb-6">
              <TitleSkeleton level={2} />

              <InputSkeleton maxLength />
              <InputSkeleton textArea maxLength />

              <CheckboxInputSkeleton />
            </FormGroupSkeleton>

            <FormGroupSkeleton>
              <TitleSkeleton level={2} />

              <InputSkeleton />
            </FormGroupSkeleton>
          </Row>

          <FormButtonsSkeleton />
        </FormSkeleton>

        <div className="flex flex-col items-start min-h-full mt-16">
          <TitleSkeleton level={2} />
          <TextSkeleton width={32} height={6} className="mt-2" />

          <TableSkeleton
            attributes={[
              ['ID', 'id'],
              ['Titre', 'title'],
              ['Description', 'description'],
              ['Type de question', 'questionType'],
            ]}
          />
        </div>
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container title="Modifier un test" breadcrumb={[{ name: 'Tests', path: '/professor/quizzes' }, { name: 'Modifier un test' }]}>
        <hr className="mb-8 mt-8" />

        <Form onSubmit={handleSubmit} full>
          <Row wrap>
            <FormGroup className="mb-6">
              <Title level={2}>Informations générales</Title>

              <Input label="Titre" value={title} setValue={setTitle} maxLength={25} />
              <Textarea label="Description" value={description} setValue={setDescription} maxLength={120} />

              <CheckboxInput
                label="Options supplémentaires"
                values={[
                  { name: 'Mode strict', checked: strict, setValue: setStrict },
                  { name: 'Mélanger les questions', checked: shuffle, setValue: setShuffle },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <Title level={2}>Utilisateurs</Title>

              <SearchInput
                label="Collaborateurs"
                placeholder="Rechercher..."
                data={professors.map(quizCollaboratorsMapper)}
                values={collaborators}
                setValues={setCollaborators}
              />
            </FormGroup>
          </Row>

          <FormButtons href="/professor/quizzes" valid={valid} update />
        </Form>

        <div className="flex flex-col items-start min-h-full mt-16">
          <Title level={2}>Questions</Title>
          <Route to={`/professor/quizzes/${quiz?.id}/questions/create`} className="mt-2">
            Créer une question
          </Route>

          <Table<Question, keyof Question>
            attributes={[
              ['ID', 'id'],
              ['Titre', 'title'],
              ['Description', 'description'],
              ['Type de question', 'questionType', questionTypeMapper],
            ]}
            data={quiz?.questions || []}
            apiName={`quizzes/${quiz?.id}/questions`}
            handleClick={handleClick}
          />
        </div>
      </Container>
    </ProfessorDashboard>
  );
};

export default Quiz;
