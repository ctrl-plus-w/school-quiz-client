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

type ServerSideProps = {
  verificationType: VerificationType;
  token: string;
};

const VerificationType: FunctionComponent<ServerSideProps> = ({ verificationType, token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [valid, setValid] = useState(false);

  const [name, setName] = useState(verificationType.name);

  useEffect(() => {
    if (name !== verificationType.name) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await database.put(`/api/verificationTypes/${verificationType.id}`, { name }, getHeaders(token));

      addNotification({ content: 'Type de vérification modifié.', type: 'INFO' });

      router.push('/admin/verificationTypes');
    } catch (err: any) {
      if (!err.response) {
        addNotification({ content: 'Une erreur est survenue.', type: 'ERROR' });
        return router.push('/admin/verificationTypes');
      }

      if (err.response.status === 403) return router.push('/login');

      if (err.response.status === 409) addNotification({ content: 'Ce type de vérification existe déja.', type: 'ERROR' });
    }
  };

  return (
    <AdminDashboardModelLayout title="Modifier un type de vérification" type="edit" onSubmit={handleSubmit} valid={valid}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="Automatique" value={name} setValue={setName} />
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
    const { data: verificationType } = await database.get(`/api/verificationTypes/${context.query.id}`, getHeaders(token));
    if (!verificationType) throw new Error();

    const props: ServerSideProps = { verificationType, token };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/admin/verificationTypes',
        permanent: false,
      },
    };
  }
};

export default VerificationType;
