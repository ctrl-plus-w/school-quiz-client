import React from 'react';

interface IProps {
  children?: React.ReactNode;
  submit?: boolean;
}

const Button = ({ children, submit = false }: IProps) => {
  return (
    <button className="button flex justify-center items-center bg-black text-white py-2 px-8 w-full" type={submit ? 'submit' : 'button'}>
      {children}
    </button>
  );
};

export default Button;
