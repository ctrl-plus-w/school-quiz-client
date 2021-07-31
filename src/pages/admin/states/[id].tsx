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
  state: State;
  token: string;
};

const State: FunctionComponent<ServerSideProps> = ({ state, token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [name, setName] = useState(state.name);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await database.put(`/api/states/${state.id}`, { name }, getHeaders(token));

      addNotification({ content: 'État modifié.', type: 'INFO' });

      router.push('/admin/states');
    } catch (err: any) {
      if (err.response && err.response.status === 403) return router.push('/login');
      else console.log(err.response);
    }
  };

  return (
    <AdminDashboardModelLayout active="États" title="Modifier un état" type="edit" onSubmit={handleSubmit}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="En attente" value={name} setValue={setName} />
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
    const { data: state } = await database.get(`/api/states/${context.query.id}`, getHeaders(token));
    if (!state) throw new Error();

    const props: ServerSideProps = { state, token };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/admin/states',
        permanent: false,
      },
    };
  }
};

export default State;
