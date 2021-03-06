import { Dispatch, ReactElement, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

import React from 'react';
import clsx from 'clsx';

interface IRadioInputProps {
  name: string;

  checked: boolean;

  setValue: () => void;
}

const BigRadioInput = ({ name, checked, setValue }: IRadioInputProps) => {
  return (
    <label
      className={clsx([
        'flex justify-center items-center w-16 h-16 rounded-sm border mr-4 transition-all duration-300',
        checked
          ? 'bg-gray-500 border-gray-900 text-gray-900'
          : 'bg-gray-400 border-gray-600 text-gray-600 cursor-pointer hover:ring hover:ring-gray-300',
      ])}
    >
      <input type="radio" className="hidden" checked={checked} onChange={setValue} />

      <p>{name}</p>
    </label>
  );
};

const NormalRadioInput = ({ name, checked, setValue }: IRadioInputProps) => {
  return (
    <label className="group flex items-center mb-0.5 cursor-pointer">
      <input type="radio" className="hidden" checked={checked} onChange={setValue} />

      <div
        className={clsx([
          'w-3 h-3 border rounded-full mr-2',
          checked ? 'bg-gray-500 border-gray-900 text-gray-900' : 'bg-gray-400 border-gray-600 text-gray-600',
        ])}
      ></div>

      <p className="text-gray-900 font-normal">{name}</p>
    </label>
  );
};

interface IProps<T> {
  values: Array<{ name: string; slug: T }>;
  label: string;
  big?: boolean;
  className?: string;

  value: T;
  setValue: Dispatch<SetStateAction<T>>;
}

const RadioInput = <T,>({ label, values, value, setValue, big = false, className }: IProps<T>): ReactElement => {
  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <div className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <div className={clsx('flex mt-2', big ? 'flex-row' : 'flex-col items-start')}>
          {values.map(({ name, slug }) => {
            const props: IRadioInputProps = { name, checked: value === slug, setValue: () => setValue(slug) };
            return big ? <BigRadioInput {...props} key={uuidv4()} /> : <NormalRadioInput {...props} key={uuidv4()} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default RadioInput;
