import '../styles/globals.css';

import React, { FunctionComponent } from 'react';
import type { AppProps } from 'next/app';

import Notifications from '@module/Notifications';

import NotificationProvider from 'context/NotificationContext/NotificationProvider';

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <NotificationProvider>
      <Notifications />
      <Component {...pageProps} />
    </NotificationProvider>
  );
};

export default MyApp;
