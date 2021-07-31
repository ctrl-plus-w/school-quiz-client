import React, { FormEvent, FunctionComponent, useContext, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import Input from '@element/Input';
import Title from '@element/Title';
import Button from '@element/Button';
import LinkButton from '@element/LinkButton';
import Loader from '@element/Loader';

import Form from '@module/Form';
import FormGroup from '@module/FormGroup';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import { getHeaders } from '@util/authentication.utils';

import ROLES from '@constant/roles';

import database from 'database/database';

import { NotificationContext } from 'context/NotificationContext/NotificationContext';

type ServerSideProps = {
  token: string;
};

const CreateLabel: FunctionComponent<ServerSideProps> = ({ token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (name === '') {
        addNotification({ content: 'Veuillez remplire tout les champs', type: 'ERROR' });
        return;
      }

      await database.post('/api/labels', { name }, getHeaders(token));

      addNotification({ content: 'Label créé.', type: 'INFO' });
      router.push('/admin/labels');
    } catch (err: any) {
      if (err.response && err.response.status === 403) return router.push('/login');
      else console.log(err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminDashboardModelLayout active="Labels" title="Créer un label" path="Labels > Créer">
        <Form full={true} onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Nom" placeholder="Premier groupe" value={name} setValue={setName} />
          </FormGroup>

          <div className="flex mt-auto ml-auto">
            <LinkButton href="/admin/labels" outline={true} className="mr-6">
              Annuler
            </LinkButton>
            <Button submit={true}>Créer</Button>
          </div>
        </Form>

        <Loader show={loading} />
      </AdminDashboardModelLayout>
    </>
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

export default CreateLabel;
