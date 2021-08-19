import { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import React from 'react';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import FormGroup from '@module/FormGroup';

import PasswordInput from '@element/PasswordInput';
import Dropdown from '@element/Dropdown';
import Input from '@element/Input';
import Title from '@element/Title';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import useAppDispatch from '@hooks/useAppDispatch';

import { addErrorNotification, addInfoNotification } from '@redux/notificationSlice';

import ROLES from '@constant/roles';

type ServerSideProps = {
  token: string;
};

const CreateUser: FunctionComponent<ServerSideProps> = ({ token }: ServerSideProps) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [valid, setValid] = useState(false);

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const [gender, setGender] = useState<'male' | 'female' | 'undefined'>('undefined');

  useEffect(() => {
    if (username !== '' || firstName !== '' || lastName !== '' || password !== '') {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [username, firstName, lastName, password]);

  const getGenderDropdownValues = (): DropdownValues => {
    return [
      { name: 'Homme', slug: 'male' },
      { name: 'Femme', slug: 'female' },
      { name: 'Indéfini', slug: 'undefined' },
    ];
  };

  const getGender = (gender: 'male' | 'female' | 'undefined'): boolean | null => {
    if (gender === 'male') return true;
    if (gender === 'female') return false;

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (username === '' || firstName === '' || lastName === '' || password === '') {
        dispatch(addErrorNotification('Veuilllez remplire tout les champs'));
        return;
      }

      if (password.length < 5) {
        dispatch(addErrorNotification('Le mot de passe est trop court'));
        return;
      }

      await database.post('/api/users', { username, firstName, lastName, password, gender: getGender(gender) }, getHeaders(token));

      dispatch(addInfoNotification('Utilisateur créé.'));
      router.push('/admin/users');
    } catch (err: any) {
      if (!err.response) {
        dispatch(addErrorNotification('Une erreur est survenue.'));
        return router.push('/admin/users');
      }

      if (err.response.status === 403) return router.push('/login');

      if (err.response.status === 422) dispatch(addErrorNotification('Un des champs est invalide'));

      if (err.response.status === 409) dispatch(addErrorNotification('Cet utilisateur existe déja.'));
    }
  };

  return (
    <AdminDashboardModelLayout title="Créer un utilisateur" type="create" onSubmit={handleSubmit} valid={valid}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom d'utilisateur" placeholder="johndoe" value={username} setValue={setUsername} />
        <Input label="Prénom" placeholder="John" value={firstName} setValue={setFirstName} />
        <Input label="Nom de famille" placeholder="Doe" value={lastName} setValue={setLastName} />

        <PasswordInput
          label="Mot de passe"
          placeholder="*****"
          value={password}
          setValue={setPassword}
          note="Le mot de passe doit faire au minimum 5 charactères"
          generator={true}
        />

        <Dropdown label="Sexe" placeholder="Indéfini" values={getGenderDropdownValues()} value={gender} setValue={setGender} />
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

export default CreateUser;
