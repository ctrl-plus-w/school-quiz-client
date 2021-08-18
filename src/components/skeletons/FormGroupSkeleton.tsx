import type { ReactElement, ReactNode } from 'react';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  className?: string;

  children?: ReactNode;
}

const FormGroupSkeleton = ({ children, className }: IProps): ReactElement => {
  return <div className={clsx(['form-group flex flex-col', className])}>{children}</div>;
};

export default FormGroupSkeleton;
