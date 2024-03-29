import { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useCookies } from 'react-cookie';

import React from 'react';

import PasswordInput from '@element/PasswordInput';
import Button from '@element/Button';
import Input from '@element/Input';
import Route from '@element/Route';
import Title from '@element/Title';

import Layout from '@layout/Default';

import FormGroup from '@module/FormGroup';
import Form from '@module/Form';
import Col from '@module/Col';

import database from '@database/database';

import ROLES from '@constant/roles';

const Login: FunctionComponent = () => {
  const [_cookie, setCookie] = useCookies(['user']);

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (errors.includes('username')) setErrors((prev) => prev.filter((value) => value !== 'username'));
  }, [username]);

  useEffect(() => {
    if (errors.includes('password')) setErrors((prev) => prev.filter((value) => value !== 'password'));
  }, [password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (username === '' || password === '') {
      const tempErrors = [];

      if (username === '') tempErrors.push('username');
      if (password === '') tempErrors.push('password');

      return setErrors(tempErrors);
    }

    try {
      const { data } = await database.post('/auth/login', { username, password });
      console.log(data);

      setCookie('user', data.token, { path: '/', maxAge: 3600, sameSite: true });

      const roleObject = Object.values(ROLES).find(({ slug }) => slug === data.role);
      router.push(roleObject?.path || '/');
    } catch (err) {
      if (err) setErrors(['username', 'password']);
    }
  };

  return (
    <Layout title="Login" center>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Col>
            <Title>Connextion</Title>
            <Route to="/password-lost">Mot de passe oublié ?</Route>
          </Col>

          <Input
            label="Nom d'utilisateur"
            placeholder="jdupont"
            value={username}
            setValue={setUsername}
            error={errors.includes('username')}
            autofocus
          />
          <PasswordInput label="Mot de passe" placeholder="****" value={password} setValue={setPassword} error={errors.includes('password')} />
          <Button submit>Se connecter</Button>
        </FormGroup>
      </Form>
    </Layout>
  );
};

export default Login;
