import { useRouter } from 'next/dist/client/router';
import { FunctionComponent } from 'react';

import React from 'react';

import LayoutSkeleton from '@layout/DefaultSkeleton';

import MenuSkeleton from '@skeleton/MenuSkeleton';

import PROFESSOR_MENU from '@constant/professorMenu';

interface IProps {
  children?: React.ReactNode;
}

const ProfessorDashboardSkeletonLayout: FunctionComponent<IProps> = ({ children }: IProps) => {
  const router = useRouter();

  const linkMapper = (links: ILink[]) =>
    links.map(({ path, active: _, ...rest }) => ({
      active: path === '/professor' ? router.pathname === path : router.pathname.startsWith(path),
      path,
      ...rest,
    }));

  return (
    <LayoutSkeleton title="Professor Dashboard" display="row">
      <MenuSkeleton logoutButton={true} links={linkMapper(PROFESSOR_MENU.links)} />

      <div className="flex flex-col flex-grow overflow-y-scroll">{children}</div>
    </LayoutSkeleton>
  );
};

export default ProfessorDashboardSkeletonLayout;
