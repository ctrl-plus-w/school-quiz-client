import Head from 'next/head';
import React from 'react';

import { enable } from '@util/style.utils';

interface Props {
  title: string;
  children?: React.ReactNode;
  center?: boolean;
}

const Layout = ({ title, children, center = false }: Props) => {
  return (
    <div className={`w-full h-full flex flex-col ${enable(center, 'justify-center items-center')}`}>
      <Head>
        <title>{title}</title>
      </Head>

      {children}
    </div>
  );
};

export default Layout;
