import type { FunctionComponent } from 'react';

import React from 'react';
import clsx from 'clsx';

import TextSkeleton from '@skeleton/TextSkeleton';

interface IProps {
  className?: string;

  primary?: boolean;
  full?: boolean;
}

const ButtonSkeleton: FunctionComponent<IProps> = ({ className, full = false, primary = false }: IProps) => {
  return (
    <div className={clsx(['flex justify-center items-center h-10.5', primary ? 'w-28' : 'px-8', full && 'w-full', className])}>
      {primary ? <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-200 rounded"></div> : <TextSkeleton color="blue" width={16} />}
    </div>
  );
};

export default ButtonSkeleton;
