import React, { FunctionComponent } from 'react';
import { useRouter } from 'next/dist/client/router';

import Layout from '@layout/Default';

import Menu from '@module/Menu';

import PROFESSOR_MENU from '@constant/professorMenu';

interface IProps {
  children?: React.ReactNode;
}

const ProfessorDashboardLayout: FunctionComponent<IProps> = ({ children }: IProps) => {
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

      <div className="flex flex-col flex-grow overflow-y-scroll">{children}</div>
    </Layout>
  );
};

export default ProfessorDashboardLayout;
