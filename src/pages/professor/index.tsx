import type { ReactElement } from 'react';

import React from 'react';

import ProfessorDashboard from '@layout/ProfessorDashboard';
import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';

import Title from '@element/Title';

import TitleSkeleton from '@skeleton/TitleSkeleton';
import TextSkeleton from '@skeleton/TextSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoading from '@hooks/useLoading';

import { selectLoggedUser } from '@redux/authSlice';

import ROLES from '@constant/roles';

const Professor = (): ReactElement => {
  const { state } = useAuthentication(ROLES.PROFESSOR.PERMISSION);

  const { loading } = useLoading([state]);

  const user = useAppSelector(selectLoggedUser);

  return loading || !user ? (
    <ProfessorDashboardSkeleton>
      <div className="flex flex-col items-start py-12 px-12">
        <TitleSkeleton />
        <TextSkeleton width={96} className="mt-4" />
      </div>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard scroll>
      <div className="flex flex-col py-12 px-12">
        <Title>Bienvenue, {user.firstName} !</Title>

        <p className="text-gray-600 font-normal mt-4">
          Vous avez sur cette page les informations globales ainsi que les informations les plus importantes.
        </p>
      </div>
    </ProfessorDashboard>
  );
};

export default Professor;
