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
import NumberInput from '@element/NumberInput';

type ServerSideProps = {
  role: Role;
  token: string;
};

const Role: FunctionComponent<ServerSideProps> = ({ role, token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [name, setName] = useState(role.name);
  const [permission, setPermission] = useState(role.permission);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await database.put(`/api/roles/${role.id}`, { name, permission }, getHeaders(token));

      addNotification({ content: 'Rôle modifié.', type: 'INFO' });

      router.push('/admin/roles');
    } catch (err: any) {
      if (err.response && err.response.status === 403) return router.push('/login');
      else console.log(err.response);
    }
  };

  return (
    <AdminDashboardModelLayout title="Modifier un rôle" type="edit" onSubmit={handleSubmit}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="En attente" value={name} setValue={setName} />
        <NumberInput label="Permission" placeholder="5" value={permission} setValue={setPermission} />
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
    const { data: role } = await database.get(`/api/roles/${context.query.id}`, getHeaders(token));
    if (!role) throw new Error();

    const props: ServerSideProps = { role: role, token };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/admin/roles',
        permanent: false,
      },
    };
  }
};

export default Role;
