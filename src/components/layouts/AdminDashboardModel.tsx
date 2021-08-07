import React, { FormEvent, FunctionComponent, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

import Button from '@element/Button';
import LinkButton from '@element/LinkButton';

import Form from '@module/Form';
import Container from '@module/Container';

import AdminDashboardLayout from '@layout/AdminDashboard';

import ADMIN_MENUS from '@constant/adminMenu';

interface IProps {
  children?: React.ReactNode;

  title: string;
  valid?: boolean;

  onSubmit: (e: FormEvent) => void;

  type: 'edit' | 'create';
}

const AdminDashboardModelLayout: FunctionComponent<IProps> = ({ children, onSubmit, title, type, valid = true }: IProps) => {
  const router = useRouter();

  const getBreadcrumbPath = (): string => {
    const splittedPathname = router.pathname.split('/');
    return splittedPathname.slice(0, splittedPathname.length - 1).join('/');
  };

  const [mainPath] = useState(getBreadcrumbPath());
  const [menuLink] = useState(ADMIN_MENUS[0].links.find(({ path }) => path === mainPath));

  return (
    <AdminDashboardLayout>
      <Container
        title={title}
        breadcrumb={[{ name: menuLink?.name || 'Accueil', path: mainPath }, { name: type === 'create' ? 'Créer' : 'Modifier' }]}
      >
        <hr className="mb-8 mt-8" />

        <Form full={true} onSubmit={onSubmit}>
          {children}

          <div className="flex mt-auto ml-auto">
            <LinkButton href={mainPath} primary={false} className="mr-6">
              Annuler
            </LinkButton>

            <Button submit={true} disabled={!valid}>
              {type === 'create' ? 'Créer' : 'Modifier'}
            </Button>
          </div>
        </Form>
      </Container>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardModelLayout;
