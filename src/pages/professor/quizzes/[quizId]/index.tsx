import React, { FormEvent, ReactElement, useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import Input from '@element/Input';
import Title from '@element/Title';
import Textarea from '@element/Textarea';
import CheckboxInput from '@element/CheckboxInput';
import Route from '@element/Route';

import Table from '@module/Table';
import Container from '@module/Container';
import Form from '@module/Form';
import FormGroup from '@module/FormGroup';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import { getHeaders } from '@util/authentication.utils';
import { questionTypeMapper } from '@util/mapper.utils';

import ROLES from '@constant/roles';

import database from 'database/database';

import { AuthContext } from 'context/AuthContext/AuthContext';

interface ServerSideProps {
  quiz: IQuiz;
  token: string;
}

const Quiz = ({ quiz, token }: ServerSideProps): ReactElement => {
  const router = useRouter();

  const { setToken } = useContext(AuthContext);

  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);
  const [strict, setStrict] = useState(quiz.strict);
  const [shuffle, setShuffle] = useState(quiz.shuffle);

  useEffect(() => setToken(token), []);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    alert();
  };

  const handleClick = (instance: Question) => {
    router.push({ pathname: `${router.pathname}/questions/[questionId]`, query: { quizId: quiz.id, questionId: instance.id } });
  };

  return (
    <ProfessorDashboard>
      <Container title="Modifier un test" breadcrumb={[{ name: 'Tests', path: '/professor/quizzes' }, { name: 'Modifier un test' }]}>
        <hr className="mb-8 mt-8" />

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Titre" value={title} setValue={setTitle} />
            <Textarea label="Description" value={description} setValue={setDescription} />

            <CheckboxInput
              label="Options supplémentaires"
              values={[
                { name: 'Mode strict', checked: strict, setValue: setStrict },
                { name: 'Mélanger les questions', checked: shuffle, setValue: setShuffle },
              ]}
            />
          </FormGroup>
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
