import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const Button = ({ children }: Props) => {
  return <button className="button flex justify-center items-center bg-black text-white py-2 px-8 w-full">{children}</button>;
};

export default Button;
