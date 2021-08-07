import React, { FunctionComponent } from 'react';
import { useRouter } from 'next/dist/client/router';

import Link from 'next/link';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import Layout from '@layout/Default';

import Menu from '@module/Menu';

import PROFESSOR_MENU from '@constant/professorMenu';

interface IProps {
  children?: React.ReactNode;
}

const ProfessorDashboardLayout: FunctionComponent<IProps> = ({ children }: IProps) => {
  const router = useRouter();

  const linkMapper = (links: ILink[]) =>
    links.map(({ name, path }) => ({
      name,
      path,
      active: path === '/professor' ? router.pathname === path : router.pathname.startsWith(path),
    }));

  return (
    <Layout title="Professor Dashboard" display="col">
      <Menu logoutButton={true}>
        <ul className="flex flex-row">
          {linkMapper(PROFESSOR_MENU.links).map(({ name, path, active }) => (
            <li key={uuidv4()} className="mr-6">
              <Link href={path}>
                <a className={clsx(['font-normal text-base', active ? 'text-blue-700' : 'text-black'])}>{name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Menu>

      <div className="flex flex-col flex-grow">{children}</div>
    </Layout>
  );
};

export default ProfessorDashboardLayout;
