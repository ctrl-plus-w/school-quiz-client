import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { login, selectError, selectToken } from '@redux/features/auth/authSlice';

interface IProps {}

const Login = (props: IProps) => {
  const [_cookie, setCookie] = useCookies(['user']);

  const router = useRouter();
  const dispatch = useDispatch();

  const loginError = useSelector(selectError);
  const token = useSelector(selectToken);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) {
      setCookie('user', token, { path: '/', maxAge: 3600, sameSite: true });
      router.push('/admin-dashboard');
    }
  }, [token]);

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
