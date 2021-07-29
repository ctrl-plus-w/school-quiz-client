import React, { useState } from 'react';
import Button from '../components/elements/Button';
import Input from '../components/elements/Input';
import PasswordInput from '../components/elements/PasswordInput';
import Route from '../components/elements/Route';
import Title from '../components/elements/Title';

import Layout from '../components/layouts/Default';
import Form from '../components/modules/Form';

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
