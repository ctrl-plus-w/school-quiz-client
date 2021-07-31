import React, { FormEvent, FunctionComponent, useContext, useState } from 'react';
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
  token: string;
};

const CreateQuestionType: FunctionComponent<ServerSideProps> = ({ token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [name, setName] = useState('');
  const [questionType, setQuestionType] = useState('textualQuestion');

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (name === '') {
        addNotification({ content: 'Veuillez remplire tout les champs', type: 'ERROR' });
        return;
      }

      await database.post('/api/questionSpecifications', { name, questionType }, getHeaders(token));

      addNotification({ content: 'Spécification créé.', type: 'INFO' });
      router.push('/admin/questionSpecifications');
    } catch (err: any) {
      if (err.response && err.response.status === 403) return router.push('/login');
      else console.log(err.response);
    }
  };

  return (
    <AdminDashboardModelLayout title="Créer une spécification" type="create" onSubmit={handleSubmit}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="Nombre entier" value={name} setValue={setName} />

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

    const props: ServerSideProps = { token };

    return { props };
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }
};

export default CreateQuestionType;
