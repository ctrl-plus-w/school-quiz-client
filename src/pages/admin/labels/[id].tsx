import { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import React from 'react';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import FormGroup from '@module/FormGroup';

import Input from '@element/Input';
import Title from '@element/Title';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import useAppDispatch from '@hooks/useAppDispatch';

import ROLES from '@constant/roles';
import { addErrorNotification, addInfoNotification } from '@redux/notificationSlice';

type ServerSideProps = {
  label: ILabel;
  token: string;
};

const Label: FunctionComponent<ServerSideProps> = ({ label, token }: ServerSideProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [valid, setValid] = useState(false);

  const [name, setName] = useState(label.name);

  useEffect(() => {
    if (name !== label.name) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (label.name === name) {
        dispatch(addErrorNotification('Vous devez modifier au moins un des champs.'));
        return;
      }

      await database.put(`/api/labels/${label.id}`, { name }, getHeaders(token));

      dispatch(addInfoNotification('Label modifié.'));

      router.push('/admin/labels');
    } catch (err: any) {
      if (!err.response) {
        dispatch(addErrorNotification('Une erreur est survenue.'));
        return router.push('/admin/labels');
      }

      if (err.response.status === 403) return router.push('/login');

      if (err.response.status === 409) dispatch(addErrorNotification('Ce label existe déja.'));
    }
  };

  return (
    <AdminDashboardModelLayout title="Modifier un label" type="edit" onSubmit={handleSubmit} valid={valid}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="Premier groupe" value={name} setValue={setName} />
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
