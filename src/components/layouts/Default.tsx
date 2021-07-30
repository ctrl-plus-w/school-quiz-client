import React, { FunctionComponent } from 'react';
import Head from 'next/head';

import { enable } from '@util/style.utils';

interface IProps {
  title: string;
  children?: React.ReactNode;
  display?: 'row' | 'col';
  center?: boolean;
}

const Layout: FunctionComponent<IProps> = ({ title, children, center = false, display = 'col' }: IProps) => {
  return (
    <div className={`w-full h-full flex flex-${display} ${enable(center, 'justify-center items-center')}`}>
      <Head>
        <title>{title}</title>
      </Head>

      {children}
    </div>
  );
};

export default Layout;
