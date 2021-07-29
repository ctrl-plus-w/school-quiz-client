import Head from 'next/head';
import React from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
}

const Layout = (props: Props) => {
  return (
    <div className="w-full h-full">
      <Head>
        <title>{props.title}</title>
      </Head>

      {props.children}
    </div>
  );
};

export default Layout;
