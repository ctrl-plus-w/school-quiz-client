const ADMIN_MENUS: Array<IMenu> = [
  {
    title: 'Général',

    links: [
      { name: 'Accueil', path: '/admin' },
      { name: 'Utilisateurs', path: '/admin/users' },
      { name: 'Groupes', path: '/admin/groups' },
      { name: 'Labels', path: '/admin/labels' },
      { name: 'États', path: '/admin/states' },
      { name: 'Rôles', path: '/admin/roles' },
      { name: 'Vérification', path: '/admin/verificationTypes' },
      { name: 'Spécification', path: '/admin/questionSpecifications' },
    ],
  },
  {
    title: 'Paramètres',

    links: [
      { name: 'Site', path: '/admin/website' },
      { name: 'Profile', path: '/admin/profile' },
    ],
  },
];

export default ADMIN_MENUS;
