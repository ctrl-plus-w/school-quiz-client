import { FunctionComponent } from 'react';

import React from 'react';

import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

interface IProps {
  children?: React.ReactNode;
}

const Helper: FunctionComponent<IProps> = ({ children }: IProps) => {
  return (
    <div className="group relative text-black hover:text-blue-500 cursor-pointer">
      <QuestionMarkCircleIcon className="h-4 w-4" />

      <div className="z-50 absolute top-6 left-0 bg-white hidden group-hover:flex">{children}</div>
    </div>
  );
};

export default Helper;
