import React from 'react';

import { FormEvent, ReactElement, useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import FormGroup from '@module/FormGroup';
import Container from '@module/Container';
import Table from '@module/Table';
import Form from '@module/Form';

import CheckboxInput from '@element/CheckboxInput';
import Textarea from '@element/Textarea';
import Input from '@element/Input';
import Title from '@element/Title';
import Route from '@element/Route';

import { getHeaders } from '@util/authentication.utils';
import { questionTypeMapper } from '@util/mapper.utils';

import { updateQuiz } from '@api/quizzes';

import database from '@database/database';

import { NotificationContext } from '@notificationContext/NotificationContext';
import { AuthContext } from '@authContext/AuthContext';

import ROLES from '@constant/roles';

interface ServerSideProps {
  quiz: IQuiz;
  token: string;
}

const Quiz = ({ quiz, token }: ServerSideProps): ReactElement => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);
  const { setToken } = useContext(AuthContext);

  const [valid, setValid] = useState(false);

  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);
  const [strict, setStrict] = useState(quiz.strict);
  const [shuffle, setShuffle] = useState(quiz.shuffle);

  useEffect(() => setToken(token), []);

  useEffect(() => {
    const isValid = (): boolean => {
      if (title === quiz.title && description === quiz.description && strict === quiz.strict && shuffle === quiz.shuffle) return false;

      return true;
    };

    if (isValid()) setValid(true);
    else setValid(false);
  }, [title, description, strict, shuffle]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    const updateAttributes: AllOptional<QuizCreationAttributes> = {
      title: title !== quiz.title ? title : undefined,
      description: description !== quiz.description ? description : undefined,
      shuffle: shuffle !== quiz.shuffle ? shuffle : undefined,
      strict: strict !== quiz.strict ? strict : undefined,
    };

    const [updatedQuiz, updateQuizError] = await updateQuiz(quiz.id, updateAttributes, token);

    if (updateQuizError) {
      if (updateQuizError.status === 403) router.push('/login');
      else addNotification({ content: updateQuizError.message, type: 'ERROR' });
    }

    if (!updatedQuiz) return;

    addNotification({ content: 'Quiz modifiée.', type: 'INFO' });
    router.push(`/professor/quizzes`);
  };

  const handleClick = (instance: Question) => {
    router.push({ pathname: `${router.pathname}/questions/[questionId]`, query: { quizId: quiz.id, questionId: instance.id } });
  };

  return (
    <ProfessorDashboard>
      <Container title="Modifier un test" breadcrumb={[{ name: 'Tests', path: '/professor/quizzes' }, { name: 'Modifier un test' }]}>
        <hr className="mb-8 mt-8" />

        <Form onSubmit={handleSubmit} full>
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

          <FormButtons href="/professor/quizzes" valid={valid} update />
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
            data={quiz.questions}
            apiName={`quizzes/${quiz.id}/questions`}
            handleClick={handleClick}
          />
        </div>
      </Container>
    </ProfessorDashboard>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = context.req.cookies.user;

  try {
    if (!token) throw new Error();

    const { data: validatedTokenData } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!validatedTokenData.valid) throw new Error();

    if (validatedTokenData.rolePermission !== ROLES.PROFESSOR.PERMISSION) throw new Error();

    const { data: quiz } = await database.get(`/api/users/${validatedTokenData.userId}/quizzes/${context.query.quizId}`, getHeaders(token));
    if (!quiz)
      return {
        redirect: {
          destination: '/professor/quizzes',
          permanent: false,
        },
      };

    const props: ServerSideProps = { quiz, token };
    return { props };
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }
};

export default Quiz;
