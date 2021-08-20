import { FormEvent, ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

import React from 'react';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
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

import CheckboxInputSkeleton from '@skeleton/CheckboxInputSkeleton';
import FormButtonsSkeleton from '@skeleton/FormButtonsSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import TableSkeleton from '@skeleton/TableSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';
import TextSkeleton from '@skeleton/TextSkeleton';

import { questionTypeMapper, collaboratorsMapper, slugMapper } from '@util/mapper.utils';
import { areArraysEquals } from '@util/condition.utils';
import { getLength } from '@util/object.utils';

import useAuthentication from '@hooks/useAuthentication';
import useLoadQuestions from '@hooks/useLoadQuestions';
import useAppSelector from '@hooks/useAppSelector';
import useLoadUsers from '@hooks/useLoadUsers';
import useLoadQuiz from '@hooks/useLoadQuiz';

import { addCollaborators, removeCollaborators, updateQuiz } from '@api/quizzes';

import useAppDispatch from '@hooks/useAppDispatch';
import useValidation from '@hooks/useValidation';
import useLoading from '@hooks/useLoading';

import { addErrorNotification } from '@redux/notificationSlice';

import { removeQuestion, selectQuestions } from '@redux/questionSlice';
import { selectProfessors, selectUser } from '@redux/userSlice';
import { selectTempQuiz } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';

import ROLES from '@constant/roles';

const Quiz = (): ReactElement => {
  const router = useRouter();

  const { quizId } = router.query;

  const dispatch = useAppDispatch();

  const { state: usersState, run: runUsers } = useLoadUsers('professeur');
  const { state: quizState, run: runQuizzes } = useLoadQuiz(parseInt(quizId as string), { notFoundRedirect: '/professor/quizzes' });
  const { state: questionState, run: runQuestion } = useLoadQuestions(parseInt(quizId as string));
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runQuizzes, runQuestion, runUsers]);

  const { loading } = useLoading([usersState, quizState, questionState, authState]);

  const user = useAppSelector(selectUser);
  const questions = useAppSelector(selectQuestions);
  const quiz = useAppSelector(selectTempQuiz);
  const token = useAppSelector(selectToken);
  const professors = useAppSelector(selectProfessors);

  const [formFilled, setFormFilled] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [strict, setStrict] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const [quizCollaborators, setQuizCollaborators] = useState<Array<IBasicModel>>([]);
  const [collaborators, setCollaborators] = useState<Array<IBasicModel>>([]);

  const [isOwner, setIsOwner] = useState(false);

  // When the quiz get loaded, set the state values.
  useEffect(() => {
    if (!quiz || !user) return;

    setTitle(quiz.title);
    setDescription(quiz.description);
    setStrict(quiz.strict);
    setShuffle(quiz.shuffle);

    setQuizCollaborators(quiz.collaborators.map(collaboratorsMapper));
    setCollaborators(quiz.collaborators.map(collaboratorsMapper));

    setIsOwner(quiz.owner.id === user.id);

    setFormFilled(true);
  }, [quiz, user]);

  // Check the validity of the form.
  const { valid } = useValidation(() => {
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
  }, [title, description, strict, shuffle, collaborators]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid || !quiz || !token || !isOwner) return;

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
        else dispatch(addErrorNotification(updateQuizError.message));
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
          else dispatch(addErrorNotification(addCollaboratorsError.message));
        }

        if (!added) return;
      }

      if (oldCollaborators.length > 0) {
        const ids = oldCollaborators.map(slugMapper).map((id) => parseInt(id));

        const [removed, removeCollaboratorsError] = await removeCollaborators(quiz.id, ids, token);

        if (removeCollaboratorsError) {
          if (removeCollaboratorsError.status === 403) router.push('/login');
          else dispatch(addErrorNotification(removeCollaboratorsError.message));
        }

        if (!removed) return;
      }
    }

    dispatch(addErrorNotification('Quiz modifiée.'));
    router.push(`/professor/quizzes`);
  };

  const handleClick = (instance: Question) => {
    if (quiz) router.push({ pathname: `${router.pathname}/questions/[questionId]`, query: { quizId: quiz.id, questionId: instance.id } });
    else router.push('/professor/quizzes');
  };

  return loading || !formFilled || !quiz || !questions || !user ? (
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

              <Input label="Titre" value={title} setValue={setTitle} maxLength={25} readonly={!isOwner} />
              <Textarea label="Description" value={description} setValue={setDescription} maxLength={120} readonly={!isOwner} />

              <CheckboxInput
                label="Options supplémentaires"
                values={[
                  { name: 'Mode strict', checked: strict, setValue: setStrict },
                  { name: 'Mélanger les questions', checked: shuffle, setValue: setShuffle },
                ]}
                readonly={!isOwner}
              />
            </FormGroup>

            <FormGroup>
              <Title level={2}>Utilisateurs</Title>

              <SearchInput
                label="Collaborateurs"
                placeholder="Rechercher..."
                data={professors.map(collaboratorsMapper)}
                values={collaborators}
                setValues={setCollaborators}
                disabled={!isOwner}
              />
            </FormGroup>
          </Row>

          {isOwner && <FormButtons href="/professor/quizzes" valid={valid} update />}
        </Form>

        <div className="flex flex-col items-start min-h-full mt-16">
          <Title level={2}>Questions</Title>
          <Route to={`/professor/quizzes/${quiz.id}/questions/create`} className="mt-2">
            Créer une question
          </Route>

          <Table<Question, keyof Question>
            attributes={[
              ['ID', 'id'],
              ['Titre', 'title'],
              ['Description', 'description'],
              ['Type de question', 'questionType', questionTypeMapper],
            ]}
            data={questions}
            apiName={`quizzes/${quiz.id}/questions`}
            handleClick={handleClick}
            removeFromStore={removeQuestion}
          />
        </div>
      </Container>
    </ProfessorDashboard>
  );
};

export default Quiz;
