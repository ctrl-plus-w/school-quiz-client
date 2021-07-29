import React, { useEffect } from 'react';

interface Props {
  children?: React.ReactNode;
}

const Form = ({ children }: Props) => {
  return <div className="form flex flex-col w-80 items-start">{children}</div>;
};

export default Form;
