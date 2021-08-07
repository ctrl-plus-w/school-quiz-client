import React, { FunctionComponent, MouseEvent } from 'react';

import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;
  submit?: boolean;
  primary?: boolean;
  className?: string;
  disabled?: boolean;
  full?: boolean;
}

const Button: FunctionComponent<IProps> = ({ children, className, full = true, submit = false, primary = true, disabled = false }: IProps) => {
  const getStyle = () => {
    if (primary) return clsx(['bg-blue-800 text-white shadow', !disabled && 'hover:bg-blue-700 hover:ring hover:ring-blue-300']);
    else return 'bg-white text-blue-700 font-medium border border-transparent';
  };

  const handleClick = (e: MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <button
      className={clsx([
        `button flex justify-center items-center py-2 px-8 rounded-sm transition-all duration-300`,
        'shadow-2xl',
        full && 'w-full',
        disabled && 'opacity-80 cursor-not-allowed',
        getStyle(),
        className,
      ])}
      type={submit ? 'submit' : 'button'}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
