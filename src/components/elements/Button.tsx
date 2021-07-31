import React, { FunctionComponent, MouseEvent } from 'react';

import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;
  submit?: boolean;
  outline?: boolean;
  className?: string;
  disabled?: boolean;
}

const Button: FunctionComponent<IProps> = ({ children, className, submit = false, outline = false, disabled = false }: IProps) => {
  const STYLES = {
    DEFAULT: {
      PLAIN: 'bg-black text-white border border-transparent',
      OUTLINE: 'bg-white text-black border border-black',
    },
    DISABLED: {
      PLAIN: 'bg-gray-800 text-gray-500 border border-transparent cursor-not-allowed',
      OUTLINE: 'bg-white text-gray-600 border-gray-600 cursor-not-allowed',
    },
  };

  const getStyle = () => {
    if (outline) {
      return disabled ? STYLES.DISABLED.OUTLINE : STYLES.DEFAULT.OUTLINE;
    } else {
      return disabled ? STYLES.DISABLED.PLAIN : STYLES.DEFAULT.PLAIN;
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <button
      className={clsx([`button flex justify-center items-center py-2 px-8 w-full rounded-sm transition-all duration-300`, getStyle(), className])}
      type={submit ? 'submit' : 'button'}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
