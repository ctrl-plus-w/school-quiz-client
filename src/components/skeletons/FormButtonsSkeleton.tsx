import type { ReactElement } from 'react';

import React from 'react';

import ButtonSkeleton from '@skeleton/ButtonSkeleton';

const FormButtonsSkeleton = (): ReactElement => {
  return (
    <div className="flex mt-auto ml-auto">
      <ButtonSkeleton className="mr-6" />
      <ButtonSkeleton primary />
    </div>
  );
};

export default FormButtonsSkeleton;
