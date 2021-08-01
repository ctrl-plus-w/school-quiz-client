import '../styles/globals.css';

import React, { FunctionComponent } from 'react';
import type { AppProps } from 'next/app';

import Notifications from '@module/Notifications';

import NotificationProvider from 'context/NotificationContext/NotificationProvider';
import AuthProvider from 'context/AuthContext/AuthProvider';

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Notifications />
        <Component {...pageProps} />
      </AuthProvider>
    </NotificationProvider>
  );
};

export default MyApp;
