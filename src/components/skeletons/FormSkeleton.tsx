import type { ReactElement, ReactNode } from 'react';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  full?: boolean;

  children?: ReactNode;
}

const FormSkeleton = ({ children, full }: IProps): ReactElement => {
  return <div className={clsx(['form flex flex-col items-start', full ? 'w-full h-full' : 'w-80'])}>{children}</div>;
};

export default FormSkeleton;
