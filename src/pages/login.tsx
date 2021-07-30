import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useCookies } from 'react-cookie';

import Button from '@element/Button';
import Input from '@element/Input';
import PasswordInput from '@element/PasswordInput';
import Route from '@element/Route';
import Title from '@element/Title';
import Error from '@element/Error';

import Layout from '@layout/Default';

import Form from '@module/Form';
import database from 'database/database';

interface IProps {}

const Login = (props: IProps) => {
  const [error, setError] = useState(false);
  const [_cookie, setCookie] = useCookies(['user']);

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await database.post('/auth/login', { username, password });

      setCookie('user', data.token, { path: '/', maxAge: 3600, sameSite: true });
      router.push('/admin');
    } catch (err) {
      if (err) setError(true);
    }
  };

  return (
    <Layout title="Login" center>
      <Form onSubmit={handleSubmit}>
        <Title>Connection</Title>
        <Route to="/password-lost">Mot de passe oublié ?</Route>

        <Input label="Nom d'utilisateur" placeholder="jdupont" value={username} setValue={setUsername} />
        <PasswordInput label="Mot de passe" placeholder="****" value={password} setValue={setPassword} />
        <Button submit>Se connecter</Button>

        {error && <Error body="Identifiants invalides" />}
      </Form>
    </Layout>
  );
};

export default Login;
