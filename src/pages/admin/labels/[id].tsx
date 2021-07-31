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
  label: Label;
  token: string;
};

const Label: FunctionComponent<ServerSideProps> = ({ label, token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(label.name);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await database.put(`/api/labels/${label.id}`, { name }, getHeaders(token));
    } catch (err: any) {
      if (err.response && err.response.status === 403) return router.push('/login');
      else console.log(err.response);
    } finally {
      setLoading(false);
      addNotification({ content: 'Label modifié.', type: 'INFO' });

      router.push('/admin/labels');
    }
  };

  return (
    <>
      <AdminDashboardModelLayout active="Labels" title="Modifier un label" path="Labels > Modifier">
        <Form full={true} onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Nom" placeholder="Premier groupe" value={name} setValue={setName} />
          </FormGroup>

          <div className="flex mt-auto ml-auto">
            <LinkButton href="/admin/labels" outline={true} className="mr-6">
              Annuler
            </LinkButton>
            <Button submit={true}>Modifier</Button>
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
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }

  try {
    const { data: label } = await database.get(`/api/labels/${context.query.id}`, getHeaders(token));
    if (!label) throw new Error();

    const props: ServerSideProps = { label, token };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/admin/labels',
        permanent: false,
      },
    };
  }
};

export default Label;
