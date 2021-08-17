import '../styles/globals.css';

import { FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';

import React from 'react';

import Notifications from '@module/Notifications';

import store from '@redux/store';

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Notifications />
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
