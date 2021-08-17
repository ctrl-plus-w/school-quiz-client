import { FunctionComponent } from 'react';

import React from 'react';

import TitleSkeleton from '@skeleton/TitleSkeleton';
import TextSkeleton from '@skeleton/TextSkeleton';

interface IProps {
  children?: React.ReactNode;
  subtitle?: boolean;
  breadcrumb?: boolean;
}

const ContainerSkeleton: FunctionComponent<IProps> = ({ children, breadcrumb = false, subtitle = false }: IProps) => {
  return (
    <div className="relative flex flex-col py-12 px-12 h-full">
      <div className="flex flex-col items-start">
        {breadcrumb && <TextSkeleton width={32} height={5} className="mb-2" />}
        <TitleSkeleton />
        {subtitle && <TextSkeleton width={32} height={6} className="mt-2" />}
      </div>

      {children}
    </div>
  );
};

export default ContainerSkeleton;
