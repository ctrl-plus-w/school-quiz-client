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
import NumberInput from '@element/NumberInput';

type ServerSideProps = {
  role: Role;
  token: string;
};

const Role: FunctionComponent<ServerSideProps> = ({ role, token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [valid, setValid] = useState(false);

  const [name, setName] = useState(role.name);
  const [permission, setPermission] = useState(role.permission);

  useEffect(() => {
    if ((name !== role.name || permission !== role.permission) && permission > 0) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [name, permission]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (permission <= 0) {
        addNotification({ content: 'La permission ne peut pas être en dessous de 1', type: 'ERROR' });
        return;
      }
      await database.put(`/api/roles/${role.id}`, { name, permission }, getHeaders(token));

      addNotification({ content: 'Rôle modifié.', type: 'INFO' });

      router.push('/admin/roles');
    } catch (err: any) {
      if (!err.response) {
        addNotification({ content: 'Une erreur est survenue.', type: 'ERROR' });
        return router.push('/admin/roles');
      }

      if (err.response.status === 403) return router.push('/login');

      if (err.response.status === 409) addNotification({ content: 'Ce rôle existe déja.', type: 'ERROR' });
    }
  };

  return (
    <AdminDashboardModelLayout title="Modifier un rôle" type="edit" onSubmit={handleSubmit} valid={valid}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="En attente" value={name} setValue={setName} />
        <NumberInput label="Permission" placeholder="5" value={permission} setValue={setPermission} note="La permission doit être supérieure à 1." />
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
