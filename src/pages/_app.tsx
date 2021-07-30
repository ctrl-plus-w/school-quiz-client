import '../styles/globals.css';

import React, { FunctionComponent } from 'react';

import type { AppProps } from 'next/app';

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
