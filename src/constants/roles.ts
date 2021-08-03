const ROLES = {
  ADMIN: {
    PERMISSION: 1,
    name: { EN: 'Admin', FR: 'Admin' },
    slug: 'admin',
    path: '/admin',
  },
  PROFESSOR: {
    PERMISSION: 2,
    name: { EN: 'Professor', FR: 'Professeur' },
    slug: 'professeur',
    path: '/professor',
  },
  STUDENT: {
    PERMISSION: 3,
    name: { EN: 'Student', FR: 'Élève' },
    slug: 'eleve',
    path: '/student',
  },
};

export default ROLES;
