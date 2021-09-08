import { useRouter } from 'next/dist/client/router';
import { FunctionComponent } from 'react';

import React from 'react';

import Layout from '@layout/Default';

import Menu from '@module/Menu';

import PROFESSOR_MENU from '@constant/professorMenu';
import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;

  scroll?: boolean;
}

const ProfessorDashboardLayout: FunctionComponent<IProps> = ({ children, scroll }: IProps) => {
  const router = useRouter();

  const linkMapper = (links: ILink[]) =>
    links.map(({ path, active: _, ...rest }) => ({
      active: path === '/professor' ? router.pathname === path : router.pathname.startsWith(path),
      path,
      ...rest,
    }));

  return (
    <Layout title="Professor Dashboard" display="row">
      <Menu logoutButton={true} links={linkMapper(PROFESSOR_MENU.links)} />

      <div className={clsx(['flex flex-col flex-grow', scroll && 'overflow-y-scroll'])}>{children}</div>
    </Layout>
  );
};

export default ProfessorDashboardLayout;
