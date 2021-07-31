import React, { FormEvent, FunctionComponent, useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import Input from '@element/Input';
import Title from '@element/Title';

import FormGroup from '@module/FormGroup';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import { getHeaders } from '@util/authentication.utils';

import ROLES from '@constant/roles';

import database from 'database/database';

import { NotificationContext } from 'context/NotificationContext/NotificationContext';
import Dropdown from '@element/Dropdown';

type ServerSideProps = {
  questionSpecification: QuestionSpecification;
  token: string;
};

const QuestionSpecification: FunctionComponent<ServerSideProps> = ({ questionSpecification, token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [valid, setValid] = useState(false);

  const [name, setName] = useState(questionSpecification.name);
  const [questionType, setQuestionType] = useState(questionSpecification.questionType);

  const getQuestionTypeDropdownValues = (): DropdownValues => {
    return [
      {
        name: 'Numérique',
        slug: 'numericQuestion',
      },
      {
        name: 'Textuelle',
        slug: 'textualQuestion',
      },
      {
        name: 'À choix',
        slug: 'choiceQuestion',
      },
    ];
  };

  useEffect(() => {
    if (name !== questionSpecification.name || questionType !== questionSpecification.questionType) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [name, questionType]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (questionSpecification.name === name && questionSpecification.questionType === questionType) {
        addNotification({ content: 'Vous devez modifier au moins un des champs.', type: 'ERROR' });
        return;
      }

      await database.put(`/api/questionSpecifications/${questionSpecification.id}`, { name, questionType }, getHeaders(token));

      addNotification({ content: 'Spécification modifié.', type: 'INFO' });

      router.push('/admin/questionSpecifications');
    } catch (err: any) {
      if (!err.response) {
        addNotification({ content: 'Une erreur est survenue.', type: 'ERROR' });
        return router.push('/admin/questionSpecifications');
      }

      if (err.response.status === 403) return router.push('/login');

      if (err.response.status === 409) addNotification({ content: 'Cette spécification existe déja.', type: 'ERROR' });
    }
  };

  return (
    <AdminDashboardModelLayout title="Modifier une spécification" type="edit" onSubmit={handleSubmit} valid={valid}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="Automatique" value={name} setValue={setName} />

        <Dropdown
          label="Type de question"
          placeholder="Textuelle"
          values={getQuestionTypeDropdownValues()}
          value={questionType}
          setValue={setQuestionType}
        />
      </FormGroup>
    </AdminDashboardModelLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = context.req.cookies.user;

  try {
    if (!token) throw new Error();

    const { data: validatedTokenData } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!validatedTokenData.valid) throw new Error();

    if (validatedTokenData.rolePermission !== ROLES.ADMIN.PERMISSION) throw new Error();
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }

  try {
    const { data: questionSpecification } = await database.get(`/api/questionSpecifications/${context.query.id}`, getHeaders(token));
    if (!questionSpecification) throw new Error();

    const props: ServerSideProps = { questionSpecification: questionSpecification, token };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/admin/questionSpecifications',
        permanent: false,
      },
    };
  }
};

export default QuestionSpecification;
