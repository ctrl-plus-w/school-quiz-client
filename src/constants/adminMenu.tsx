import React from 'react';

import { UserCircleIcon, VideoCameraIcon, HomeIcon, UsersIcon } from '@heroicons/react/outline';

const ADMIN_MENUS: IMenu = {
  title: 'Général',

  links: [
    { name: 'Accueil', path: '/admin', icon: <HomeIcon className="w-6 h-6" />, active: false },
    { name: 'Utilisateurs', path: '/admin/users', icon: <UsersIcon className="w-6 h-6" />, active: false },
    // { name: 'Groupes', path: '/admin/groups', icon: <></>, active: false },
    // { name: 'Labels', path: '/admin/labels', icon: <></>, active: false },
    // { name: 'États', path: '/admin/states', icon: <></>, active: false },
    // { name: 'Rôles', path: '/admin/roles', icon: <></>, active: false },
    // { name: 'Vérification', path: '/admin/verificationTypes', icon: <></>, active: false },
    // { name: 'Spécification', path: '/admin/questionSpecifications', icon: <></>, active: false },
    { name: 'Profile', path: '/professor/profile', icon: <UserCircleIcon className="w-6 h-6" />, active: false },
    { name: 'Direct', path: '/professor/direct', icon: <VideoCameraIcon className="h-6 w-6" />, active: false },
  ],
};

export default ADMIN_MENUS;
