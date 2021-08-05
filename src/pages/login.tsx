import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useCookies } from 'react-cookie';

import Button from '@element/Button';
import Input from '@element/Input';
import PasswordInput from '@element/PasswordInput';
import Route from '@element/Route';
import Title from '@element/Title';
import ErrorModal from '@element/Error';

import Layout from '@layout/Default';

import Form from '@module/Form';

import database from 'database/database';
import roles from '@constant/roles';
import FormGroup from '@module/FormGroup';
import Col from '@module/Col';

const Login: FunctionComponent = () => {
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(false);
  const [_cookie, setCookie] = useCookies(['user']);

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => setValid(username !== '' && password !== ''), [username, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!valid) return;

    try {
      const { data } = await database.post('/auth/login', { username, password });

      setCookie('user', data.token, { path: '/', maxAge: 3600, sameSite: true });

      const roleObject = Object.values(roles).find(({ slug }) => slug === data.role);
      router.push(roleObject?.path || '/');
    } catch (err) {
      if (err) setError(true);
    }
  };

  return (
    <Layout title="Login" center>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Col>
            <Title>Connection</Title>
            <Route to="/password-lost">Mot de passe oublié ?</Route>
          </Col>

          <Input label="Nom d'utilisateur" placeholder="jdupont" value={username} setValue={setUsername} />
          <PasswordInput label="Mot de passe" placeholder="****" value={password} setValue={setPassword} />
          <Button disabled={!valid} submit>
            Se connecter
          </Button>

          {error && <ErrorModal body="Identifiants invalides" />}
        </FormGroup>
      </Form>
    </Layout>
  );
};

export default Login;
