import { FunctionComponent } from 'react';

import clsx from 'clsx';
import React from 'react';

interface IProps {
  className?: string;
  children?: React.ReactNode;
}

const FormGroup: FunctionComponent<IProps> = ({ children, className }: IProps) => {
  return <div className={clsx(['form-group flex flex-col', className])}>{children}</div>;
};

export default FormGroup;
