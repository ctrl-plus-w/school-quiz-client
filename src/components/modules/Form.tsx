import React, { FormEvent } from 'react';

interface IProps {
  children?: React.ReactNode;
  onSubmit?: (e: FormEvent) => void;
}

const Form = ({ children, onSubmit }: IProps) => {
  return (
    <form className="form flex flex-col w-80 items-start" onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;
