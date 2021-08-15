import '../styles/globals.css';

import { FunctionComponent } from 'react';
import { AppProps } from 'next/app';

import React from 'react';

import Notifications from '@module/Notifications';

import NotificationProvider from '@notificationContext/NotificationProvider';
import AuthProvider from '@authContext/AuthProvider';

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
