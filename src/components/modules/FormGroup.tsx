import React from 'react';

interface IProps {
  children?: React.ReactNode;
}

const FormGroup = ({ children }: IProps) => {
  return <div className="form-group flex flex-col">{children}</div>;
};

export default FormGroup;
