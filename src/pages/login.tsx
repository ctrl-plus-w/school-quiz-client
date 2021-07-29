import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@element/Button';
import Input from '@element/Input';
import PasswordInput from '@element/PasswordInput';
import Route from '@element/Route';
import Title from '@element/Title';

import Layout from '@layout/Default';

import Form from '@module/Form';

import { login, selectError, selectState } from '@redux/features/auth/authSlice';
import Error from '@element/Error';

interface IProps {}

const Login = (props: IProps) => {
  const loginError = useSelector(selectError);
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    dispatch(login({ username, password }));
  };

  return (
    <Layout title="Login" center>
      <Form onSubmit={handleSubmit}>
        <Title>Connection</Title>
        <Route to="/password-lost">Mot de passe oublié ?</Route>

        <Input label="Nom d'utilisateur" placeholder="jdupont" value={username} setValue={setUsername} />
        <PasswordInput label="Mot de passe" placeholder="****" value={password} setValue={setPassword} />
        <Button submit>Se connecter</Button>

        {loginError && <Error body="Identifiants invalides" />}
      </Form>
    </Layout>
  );
};

export default Login;
