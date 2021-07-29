import React, { useState } from 'react';
import Button from '@element/Button';
import Input from '@element/Input';
import PasswordInput from '@element/PasswordInput';
import Route from '@element/Route';
import Title from '@element/Title';

import Layout from '@layout/Default';
import Form from '@module/Form';

interface Props {}

const Login = (props: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Layout title="Login" center>
      <Form>
        <Title>Connection</Title>
        <Route to="/password-lost">Mot de passe oublié ?</Route>

        <Input label="Nom d'utilisateur" placeholder="jdupont" value={username} setValue={setUsername} />
        <PasswordInput label="Mot de passe" placeholder="****" value={password} setValue={setPassword} />
        <Button>Se connecter</Button>
      </Form>
    </Layout>
  );
};

export default Login;
