import { createContext } from 'react';

export const contextDefaultValues: AuthContextState = {
  token: '',
  setToken: (token: string) => null,
};

export const AuthContext = createContext<AuthContextState>(contextDefaultValues);
