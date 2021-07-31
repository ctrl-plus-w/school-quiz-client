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

type ServerSideProps = {
  token: string;
};

const CreateGroup: FunctionComponent<ServerSideProps> = ({ token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [name, setName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (name === '') {
        addNotification({ content: 'Veuillez remplir tout les champs', type: 'ERROR' });
        return;
      }

      await database.post('/api/groups', { name }, getHeaders(token));

      addNotification({ content: 'Groupe créé.', type: 'INFO' });
      router.push('/admin/groups');
    } catch (err: any) {
      if (err.response && err.response.status === 403) return router.push('/login');
      else console.log(err.response);
    }
  };

  return (
    <AdminDashboardModelLayout  title="Créer un groupe" type="create" onSubmit={handleSubmit}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="Term1" value={name} setValue={setName} />
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

export default CreateGroup;
