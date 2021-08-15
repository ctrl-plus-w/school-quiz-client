import { FormEvent, FunctionComponent, useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import React from 'react';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import FormGroup from '@module/FormGroup';

import Input from '@element/Input';
import Title from '@element/Title';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import { NotificationContext } from '@notificationContext/NotificationContext';

import ROLES from '@constant/roles';

type ServerSideProps = {
  state: IState;
  token: string;
};

const State: FunctionComponent<ServerSideProps> = ({ state, token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [valid, setValid] = useState(false);

  const [name, setName] = useState(state.name);

  useEffect(() => {
    if (name !== state.name) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await database.put(`/api/states/${state.id}`, { name }, getHeaders(token));

      addNotification({ content: 'État modifié.', type: 'INFO' });

      router.push('/admin/states');
    } catch (err: any) {
      if (!err.response) {
        addNotification({ content: 'Une erreur est survenue.', type: 'ERROR' });
        return router.push('/admin/states');
      }

      if (err.response.status === 403) return router.push('/login');

      if (err.response.status === 409) addNotification({ content: 'Cet état existe déja.', type: 'ERROR' });
    }
  };

  return (
    <AdminDashboardModelLayout title="Modifier un état" type="edit" onSubmit={handleSubmit} valid={valid}>
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
