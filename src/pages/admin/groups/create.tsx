import React, { FormEvent, FunctionComponent, useContext, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
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

const CreateGroup: FunctionComponent = ({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminDashboardModelLayout active="Groupes" title="Créer un groupe" path="Groupes > Créer">
        <Form full={true} onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Nom" placeholder="Term1" value={name} setValue={setName} />
          </FormGroup>

          <div className="flex mt-auto ml-auto">
            <LinkButton href="/admin/groups" outline={true} className="mr-6">
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

    return { props: { token } };
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }
};

export default CreateGroup;
