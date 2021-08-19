import { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import React from 'react';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import FormGroup from '@module/FormGroup';

import Dropdown from '@element/Dropdown';
import Input from '@element/Input';
import Title from '@element/Title';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import useAppDispatch from '@hooks/useAppDispatch';

import { addErrorNotification, addInfoNotification } from '@redux/notificationSlice';

import ROLES from '@constant/roles';

type ServerSideProps = {
  token: string;
};

const CreateQuestionType: FunctionComponent<ServerSideProps> = ({ token }: ServerSideProps) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [valid, setValid] = useState(false);

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

  useEffect(() => {
    if (name !== '') {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (name === '') {
        dispatch(addErrorNotification('Veuilllez remplire tout les champs'));
        return;
      }

      await database.post('/api/questionSpecifications', { name, questionType }, getHeaders(token));

      dispatch(addInfoNotification('Spécification créé'));
      router.push('/admin/questionSpecifications');
    } catch (err: any) {
      if (!err.response) {
        dispatch(addErrorNotification('Une erreur est survenue.'));
        return router.push('/admin/questionSpecifications');
      }

      if (err.response.status === 403) return router.push('/login');

      if (err.response.status === 409) dispatch(addErrorNotification('Cette spécification existe déja.'));
    }
  };

  return (
    <AdminDashboardModelLayout title="Créer une spécification" type="create" onSubmit={handleSubmit} valid={valid}>
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
