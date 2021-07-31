const ADMIN_MENUS: Array<IMenu> = [
  {
    title: 'Général',

    links: [
      { name: 'Accueil', path: '/admin' },
      { name: 'Utilisateurs', path: '/admin/users' },
      { name: 'Groupes', path: '/admin/groups' },
      { name: 'Labels', path: '/admin/labels' },
      { name: 'États', path: '/admin/states' },
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
