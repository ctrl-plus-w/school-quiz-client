import { Dispatch, ReactElement, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  label: string;
  className?: string;

  readonly?: boolean;

  values: Array<{ name: string; checked: boolean; setValue: Dispatch<SetStateAction<boolean>> }>;
}

const CheckboxInput = ({ label, values, className, readonly = false }: IProps): ReactElement => {
  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <div className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <div className="flex mt-2 flex-col items-start">
          {values.map(({ name, checked, setValue }) => (
            <label className={clsx(['group flex items-center mb-0.5', !readonly && 'cursor-pointer'])} key={uuidv4()}>
              <input type="checkbox" className="hidden" checked={checked} onChange={() => !readonly && setValue((prev) => !prev)} />

              <div
                className={clsx([
                  'w-3 h-3 border rounded-sm mr-2 transition-all duration-100',
                  checked
                    ? clsx(['bg-green-600 border-green-800', !readonly && 'group-hover:ring group-hover:ring-green-200'])
                    : clsx(['bg-gray-400 border-gray-600', !readonly && 'group-hover:ring group-hover:ring-gray-300']),
                ])}
              ></div>

              <p className="text-gray-900 font-normal">{name}</p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckboxInput;
