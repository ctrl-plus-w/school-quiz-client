import React from 'react';

import { HomeIcon, AcademicCapIcon, UserCircleIcon } from '@heroicons/react/outline';

const STUDENT_MENU: IMenu = {
  title: '',

  links: [
    { name: 'Accueil', path: '/student', icon: <HomeIcon className="w-6 h-6" />, active: false },
    { name: 'Tests', path: '/student/quiz', icon: <AcademicCapIcon className="w-6 h-6" />, active: false },
    { name: 'Profile', path: '/student/profile', icon: <UserCircleIcon className="h-6 w-6" />, active: false },
  ],
};

export default STUDENT_MENU;
