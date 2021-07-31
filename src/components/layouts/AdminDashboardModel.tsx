import Button from '@element/Button';
import LinkButton from '@element/LinkButton';
import Container from '@module/Container';
import Form from '@module/Form';
import { useRouter } from 'next/dist/client/router';
import React, { FormEvent, FunctionComponent, useState } from 'react';
import AdminDashboardLayout from './AdminDashboard';

interface IProps {
  children?: React.ReactNode;

  active: string;
  title: string;

  onSubmit: (e: FormEvent) => void;

  type: 'edit' | 'create';
}

const AdminDashboardModelLayout: FunctionComponent<IProps> = ({ children, onSubmit, active, title, type }: IProps) => {
  const router = useRouter();

  const getBreadcrumbPath = (): string => {
    const splittedPathname = router.pathname.split('/');
    return splittedPathname.slice(0, splittedPathname.length - 1).join('/');
  };

  const [mainPath] = useState(getBreadcrumbPath());

  return (
    <AdminDashboardLayout active={active}>
      <Container title={title} breadcrumb={[{ name: active, path: mainPath }, { name: type === 'create' ? 'Créer' : 'Modifier' }]}>
        <hr className="mb-8 mt-8" />

        <Form full={true} onSubmit={onSubmit}>
          {children}

          <div className="flex mt-auto ml-auto">
            <LinkButton href={mainPath} outline={true} className="mr-6">
              Annuler
            </LinkButton>

            <Button submit={true}>{type === 'create' ? 'Créer' : 'Modifier'}</Button>
          </div>
        </Form>
      </Container>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardModelLayout;
