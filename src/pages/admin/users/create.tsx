import React, { FormEvent, FunctionComponent, useContext, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/dist/client/router';

// import { v4 as uuidv4 } from 'uuid';

import Input from '@element/Input';
import Title from '@element/Title';
import Dropdown from '@element/Dropdown';
import Button from '@element/Button';
import LinkButton from '@element/LinkButton';
import PasswordInput from '@element/PasswordInput';

import Form from '@module/Form';
import FormGroup from '@module/FormGroup';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import { getHeaders } from '@util/authentication.utils';

import ROLES from '@constant/roles';
import Loader from '@element/Loader';

import database from 'database/database';

import { NotificationContext } from 'context/NotificationContext/NotificationContext';

const CreateUser: FunctionComponent = ({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const [gender, setGender] = useState<'male' | 'female' | 'undefined'>('undefined');

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
      setLoading(true);

      if (username === '' || firstName === '' || lastName === '' || password === '') {
        addNotification({ content: 'Veuillez remplire tout les champs', type: 'ERROR' });
        return;
      }

      if (password.length < 5) {
        addNotification({ content: 'Le mot de passe est trop court', type: 'ERROR' });
        return;
      }

      await database.post('/api/users', { username, firstName, lastName, password, gender: getGender(gender) }, getHeaders(token));

      addNotification({ content: 'Utilisateur créé.', type: 'INFO' });
      router.push('/admin/users');
    } catch (err: any) {
      if (!err.response) {
        addNotification({ content: 'Une erreur est survenue.', type: 'ERROR' });
        return router.push('/admin/users');
      }

      if (err.response.status === 406) return router.push('/login');

      if (err.response.status === 422) addNotification({ content: 'Un des champs est invalide.', type: 'ERROR' });

      if (err.response.status === 409) addNotification({ content: 'Cet utilisateur existe déja.', type: 'ERROR' });

      console.log(err.response);
      // if(err.response.status ===)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminDashboardModelLayout active="Utilisateurs" title="Créer un utilisateur" path="Utilisateurs > Créer">
        <Form full={true} onSubmit={handleSubmit}>
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

          <div className="flex mt-auto ml-auto">
            <LinkButton href="/admin/users" outline={true} className="mr-6">
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

export default CreateUser;
