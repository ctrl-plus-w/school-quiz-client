import { FormEvent, ReactElement, useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import React from 'react';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import FormGroup from '@module/FormGroup';
import Container from '@module/Container';
import Form from '@module/Form';

import CheckboxInput from '@element/CheckboxInput';
import Textarea from '@element/Textarea';
import Input from '@element/Input';
import Title from '@element/Title';

import { getHeaders } from '@util/authentication.utils';

import { createQuiz } from '@api/quizzes';

import database from '@database/database';

import { NotificationContext } from '@notificationContext/NotificationContext';

import ROLES from '@constant/roles';

interface IServerSideProps {
  token: string;
}

const CreateQuiz = ({ token }: IServerSideProps): ReactElement => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [valid, setValid] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [strict, setStrict] = useState(true);
  const [shuffle, setShuffle] = useState(true);

  useEffect(() => {
    if (title !== '' && description !== '') {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [title, description]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const [created, error] = await createQuiz({ title, description, strict, shuffle }, token);

    if (created) {
      addNotification({ content: 'Test créé.', type: 'INFO' });
      router.push('/professor/quizzes');
      return;
    } else if (error) {
      if (error.status === 403) {
        router.push('/login');
      } else {
        addNotification({ content: error.message, type: 'ERROR' });
      }
    }
  };

  return (
    <ProfessorDashboard>
      <Container title="Créer un test" breadcrumb={[{ name: 'Tests', path: '/professor/quizzes' }, { name: 'Créer un test' }]}>
        <hr className="mb-8 mt-8" />

        <Form full={true} onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Titre" placeholder="Comment... ?" value={title} setValue={setTitle} maxLength={25} />

            <Textarea label="Description" placeholder="Lorem ipsum dolo..." value={description} setValue={setDescription} maxLength={120} />

            <CheckboxInput
              label="Options supplémentaires"
              values={[
                { name: 'Mode strict', checked: strict, setValue: setStrict },
                { name: 'Mélanger les questions', checked: shuffle, setValue: setShuffle },
              ]}
            />
          </FormGroup>

          <FormButtons href="/professor/quizzes" valid={valid} />
        </Form>
      </Container>
    </ProfessorDashboard>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const token = context.req.cookies.user;
    if (!token) throw new Error();

    const { data } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!data.valid) throw new Error();

    if (data.rolePermission !== ROLES.PROFESSOR.PERMISSION) throw new Error();

    const props: IServerSideProps = { token };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

export default CreateQuiz;
