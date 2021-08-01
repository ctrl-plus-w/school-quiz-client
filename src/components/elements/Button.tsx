import React, { FunctionComponent, MouseEvent } from 'react';

import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;
  submit?: boolean;
  outline?: boolean;
  className?: string;
  disabled?: boolean;
  full?: boolean;
  color?: 'black' | 'red';
}

const Button: FunctionComponent<IProps> = ({
  children,
  className,
  color = 'black',
  full = true,
  submit = false,
  outline = false,
  disabled = false,
}: IProps) => {
  const STYLES = {
    DEFAULT: {
      BLACK: 'bg-black text-white border border-transparent',
      RED: 'bg-red-700 text-white border border-transparent',

      OUTLINE_BLACK: 'bg-white text-black border border-black',
      OUTLINE_RED: 'bg-white text-red-700 border border-red-700',
    },
    DISABLED: {
      BLACK: 'bg-gray-800 text-gray-500 border border-transparent cursor-not-allowed',
      RED: 'bg-red-500 text-red-300 border border-transparent cursor-not-allowed',

      OUTLINE_BLACK: 'bg-white text-gray-600 border-gray-600 cursor-not-allowed',
      OUTLINE_RED: 'bg-white text-red-300 border-red-500 cursor-not-allowed',
    },
  };

  const getStyle = () => {
    if (outline) {
      if (color === 'black') {
        return disabled ? STYLES.DISABLED.OUTLINE_BLACK : STYLES.DEFAULT.OUTLINE_BLACK;
      } else {
        return disabled ? STYLES.DISABLED.OUTLINE_RED : STYLES.DEFAULT.OUTLINE_RED;
      }
    } else {
      if (color === 'black') {
        return disabled ? STYLES.DISABLED.BLACK : STYLES.DEFAULT.BLACK;
      } else {
        return disabled ? STYLES.DISABLED.RED : STYLES.DEFAULT.RED;
      }
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
      className={clsx([
        `button flex justify-center items-center py-2 px-8 rounded-sm transition-all duration-300`,
        full && ' w-full',
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
