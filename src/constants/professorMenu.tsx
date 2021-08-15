import React from 'react';

import { HomeIcon, CalendarIcon, AcademicCapIcon, UserCircleIcon, VideoCameraIcon } from '@heroicons/react/outline';

const PROFESSOR_MENU: IMenu = {
  title: '',

  links: [
    { name: 'Accueil', path: '/professor', icon: <HomeIcon className="w-6 h-6" />, active: false },
    { name: 'Événements', path: '/professor/events', icon: <CalendarIcon className="w-6 h-6" />, active: false },
    { name: 'Tests', path: '/professor/quizzes', icon: <AcademicCapIcon className="w-6 h-6" />, active: false },
    { name: 'Profile', path: '/professor/profile', icon: <UserCircleIcon className="w-6 h-6" />, active: false },
    { name: 'Direct', path: '/professor/direct', icon: <VideoCameraIcon className="h-6 w-6" />, active: false },
  ],
};

export default PROFESSOR_MENU;
