import React, { ChangeEvent, Dispatch, KeyboardEvent, ReactElement, SetStateAction, useState } from 'react';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import { XIcon } from '@heroicons/react/outline';

interface IProps {
  label: string;
  placeholder: string;

  maxLength?: number;

  className?: string;

  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
}

const MultipleTextInput = ({ className, label, placeholder, values, setValues, maxLength }: IProps): ReactElement => {
  const [tempValue, setTempValue] = useState('');

  const addValue = (str: string): void => {
    setValues((prev) => [...prev, str]);
  };

  const removeValue = (str: string): void => {
    setValues((prev) => prev.filter((val) => val !== str));
  };

  const handleInput = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== 'Enter' || tempValue.length === 0) return;

    e.preventDefault();
    e.stopPropagation();

    if (tempValue === '' || values.includes(tempValue)) return;

    addValue(tempValue);
    setTempValue('');
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTempValue(e.target.value);
  };

  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <label className="relative text-sm font-semibold text-gray-900">
        <div className="flex items-center">
          <span className="uppercase mr-2">{label}</span>
        </div>

        <input
          type="text"
          className="form-input"
          placeholder={placeholder}
          onKeyDown={handleInput}
          value={tempValue}
          onChange={onChange}
          maxLength={maxLength}
        />
      </label>

      <div className="flex flex-wrap w-full text-sm">
        {values.map((str) => (
          <div
            className={clsx([
              'flex items-center py-0.75 pl-2 pr-1.5 mr-2 mt-2 border  rounded-sm cursor-pointer',
              'bg-gray-300 border-gray-500 hover:bg-red-200 hover:border-red-800 hover:text-red-800',
            ])}
            onClick={() => removeValue(str)}
            key={uuidv4()}
          >
            <p className="font-normal mr-1" key={uuidv4()}>
              {str}
            </p>

            <XIcon className="h-4 w-4 " />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleTextInput;
