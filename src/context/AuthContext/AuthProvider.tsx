import { FunctionComponent, useState } from 'react';

import React from 'react';

import { contextDefaultValues, AuthContext } from './AuthContext';

interface IProps {
  children?: React.ReactNode;
}

const AuthProvider: FunctionComponent<IProps> = ({ children }: IProps) => {
  const [token, setToken] = useState<string>(contextDefaultValues.token);

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
