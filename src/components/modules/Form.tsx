import React, { FormEvent, FunctionComponent } from 'react';

import clsx from 'clsx';

interface IProps {
  full?: boolean;
  children?: React.ReactNode;
  onSubmit?: (e: FormEvent) => void;
}

const Form: FunctionComponent<IProps> = ({ children, onSubmit, full = false }: IProps) => {
  return (
    <form className={clsx(['form flex flex-col items-start', full ? 'w-full h-full' : 'w-80'])} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;
