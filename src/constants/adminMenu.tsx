import React from 'react';

const ADMIN_MENUS: Array<IMenu> = [
  {
    title: 'Général',

    links: [
      { name: 'Accueil', path: '/admin', icon: <></>, active: false },
      { name: 'Utilisateurs', path: '/admin/users', icon: <></>, active: false },
      { name: 'Groupes', path: '/admin/groups', icon: <></>, active: false },
      { name: 'Labels', path: '/admin/labels', icon: <></>, active: false },
      { name: 'États', path: '/admin/states', icon: <></>, active: false },
      { name: 'Rôles', path: '/admin/roles', icon: <></>, active: false },
      { name: 'Vérification', path: '/admin/verificationTypes', icon: <></>, active: false },
      { name: 'Spécification', path: '/admin/questionSpecifications', icon: <></>, active: false },
    ],
  },
  {
    title: 'Paramètres',

    links: [
      { name: 'Site', path: '/admin/website', icon: <></>, active: false },
      { name: 'Profile', path: '/admin/profile', icon: <></>, active: false },
    ],
  },
];

export default ADMIN_MENUS;
