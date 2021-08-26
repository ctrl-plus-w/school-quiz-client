import { useRouter } from 'next/dist/client/router';
import { FunctionComponent } from 'react';

import React from 'react';

import Layout from '@layout/Default';

import Menu from '@module/Menu';

import STUDENT_MENU from '@constant/studentMenu';

interface IProps {
  children?: React.ReactNode;

  hideMenu?: boolean;
}

const StudentDashboard: FunctionComponent<IProps> = ({ children, hideMenu = false }: IProps) => {
  const router = useRouter();

  const linkMapper = (links: ILink[]) =>
    links.map(({ path, active: _, ...rest }) => ({
      active: path === '/student' ? router.pathname === path : router.pathname.startsWith(path),
      path,
      ...rest,
    }));

  return (
    <Layout title="Élève" display="row">
      {!hideMenu && <Menu logoutButton={true} links={linkMapper(STUDENT_MENU.links)} />}

      <div className="flex flex-col flex-grow overflow-y-scroll">{children}</div>
    </Layout>
  );
};

export default StudentDashboard;
