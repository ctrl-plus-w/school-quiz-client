import { useSelector } from 'react-redux';

import type { ReactElement } from 'react';

import React from 'react';

import Title from '@element/Title';

import StudentDashboardSkeleton from '@layout/StudentDashboardSkeleton';
import StudentDashboard from '@layout/StudentDashboard';

import TitleSkeleton from '@skeleton/TitleSkeleton';
import TextSkeleton from '@skeleton/TextSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useLoading from '@hooks/useLoading';

import { selectUser } from '@redux/userSlice';

import ROLES from '@constant/roles';

const Student = (): ReactElement => {
  const { state } = useAuthentication(ROLES.STUDENT.PERMISSION);

  const { loading } = useLoading([state]);

  const user = useSelector(selectUser);

  return loading || !user ? (
    <StudentDashboardSkeleton>
      <div className="flex flex-col items-start py-12 px-12">
        <TitleSkeleton />
        <TextSkeleton width={96} className="mt-4" />
      </div>
    </StudentDashboardSkeleton>
  ) : (
    <StudentDashboard>
      <div className="flex flex-col py-12 px-12">
        <Title>Bienvenue, {user.firstName} !</Title>

        <p className="text-gray-600 font-normal mt-4">
          Vous avez sur cette page les informations globales ainsi que les informations les plus importantes.
        </p>
      </div>
    </StudentDashboard>
  );
};

export default Student;
