import { FunctionComponent, MouseEvent } from 'react';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;

  className?: string;

  type?: 'info' | 'success' | 'error';

  primary?: boolean;
  submit?: boolean;
  disabled?: boolean;
  full?: boolean;

  onClick?: (e: MouseEvent) => void;
}

const Button: FunctionComponent<IProps> = ({
  children,
  className,
  full = true,
  submit = false,
  primary = true,
  disabled = false,
  type = 'info',
  onClick,
}: IProps) => {
  const getSecondaryStyle = () => {
    switch (type) {
      case 'error':
        return clsx(['bg-transparent text-red-700 font-medium border border-transparent', !disabled && 'hover:text-red-500']);
      case 'info':
        return clsx(['bg-transparent text-blue-700 font-medium border border-transparent', !disabled && 'hover:text-blue-500']);
      case 'success':
        return clsx(['bg-transparent text-green-700 font-medium border border-transparent', !disabled && 'hover:text-green-600']);
    }
  };

  const getPrimaryStyle = () => {
    switch (type) {
      case 'error':
        return clsx(['bg-red-800 text-white shadow', !disabled && 'hover:bg-red-700 hover:ring hover:ring-red-300']);
      case 'info':
        return clsx(['bg-blue-800 text-white shadow', !disabled && 'hover:bg-blue-700 hover:ring hover:ring-blue-300']);
      case 'success':
        return clsx(['bg-green-700 text-white shadow', !disabled && 'hover:bg-green-600 hover:ring hover:ring-green-200']);
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }

    onClick && onClick(e);
  };

  return (
    <button
      className={clsx([
        `button flex justify-center items-center py-2 px-8 rounded-sm transition-all duration-300 shadow-2xl`,
        full && 'w-full',
        disabled ? 'opacity-80 cursor-not-allowed' : 'transform active:scale-95',
        primary ? getPrimaryStyle() : getSecondaryStyle(),
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
