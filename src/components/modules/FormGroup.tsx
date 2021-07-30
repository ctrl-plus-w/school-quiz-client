import React, { FunctionComponent } from 'react';

interface IProps {
  children?: React.ReactNode;
}

const FormGroup: FunctionComponent<IProps> = ({ children }: IProps) => {
  return <div className="form-group flex flex-col">{children}</div>;
};

export default FormGroup;
