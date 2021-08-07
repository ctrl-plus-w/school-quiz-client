import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

interface IProps {
  show: boolean;
}

const Loader: FunctionComponent<IProps> = ({ show }: IProps) => {
  return (
    <div
      className={clsx(['z-50 absolute flex justify-center items-center w-full h-full top-0 left-0 bg-white opacity-75', show ? 'visible' : 'hidden'])}
    >
      <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path fill="black" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

export default Loader;
