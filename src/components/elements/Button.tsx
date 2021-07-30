import React, { FunctionComponent } from 'react';

interface IProps {
  children?: React.ReactNode;
  submit?: boolean;
  outline?: boolean;
  className?: string;
}

const Button: FunctionComponent<IProps> = ({ children, className, submit = false, outline = false }: IProps) => {
  const STYLES = {
    DEFAULT: 'bg-black text-white border border-transparent',
    OUTLINE: 'bg-white text-black border border-black',
  };

  return (
    <button
      className={`button flex justify-center items-center py-2 px-8 w-full rounded-sm ${outline ? STYLES.OUTLINE : STYLES.DEFAULT} ${className}`}
      type={submit ? 'submit' : 'button'}
    >
      {children}
    </button>
  );
};

export default Button;
