import React, { ChangeEvent, FunctionComponent, KeyboardEvent, useState } from 'react';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import { XIcon } from '@heroicons/react/outline';

import Helper from './Helper';

interface IProps {
  label: string;
  placeholder: string;

  className?: string;

  children?: React.ReactNode;

  data: Array<IBasicModel>;

  values: Array<IBasicModel>;
  addValue: (instance: IBasicModel) => void;
  removeValue: (instance: IBasicModel) => void;
}

const TagsInput: FunctionComponent<IProps> = ({ className, label, placeholder, values, addValue, removeValue, data }: IProps) => {
  const [tempValue, setTempValue] = useState('');
  const [completion, setCompletion] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleInput = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    e.stopPropagation();

    const instance = data.find(({ name }) => name === tempValue);
    if (!instance) return;

    if (values.some(({ name }) => name === tempValue)) return;

    addValue(instance);
    setTempValue('');
    setCompletion('');
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    setTempValue(e.target.value);

    const remainingData = data.filter(({ name }) => !values.map(({ name: _name }) => _name).includes(name));
    const potentialInstance = remainingData.find(({ name }) => name.startsWith(value));

    if (!potentialInstance) {
      setCompletion('');
      setIsValid(false);
      return;
    }

    if (value == '') setCompletion('');
    else setCompletion(potentialInstance.name.slice(value.length));

    if (potentialInstance.name === value) setIsValid(true);
    else setIsValid(false);
  };

  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <label className="relative text-sm font-semibold text-gray-900">
        <div className="flex items-center">
          <span className="uppercase mr-2">{label}</span>

          <Helper>
            <div className="flex flex-col border border-gray-500 rounded-sm px-2 py-2">
              {data.map((instance) => (
                <p className="text-black font-normal py-1 px-1" key={uuidv4()}>
                  {instance.name}
                </p>
              ))}
            </div>
          </Helper>
        </div>

        <div className="relative">
          <input
            type="text"
            className={clsx(['form-input', isValid && 'text-green-600'])}
            placeholder={placeholder}
            onKeyDown={handleInput}
            value={tempValue}
            onChange={onChange}
          />

          <p className="absolute top-1/2 left-0 transform -translate-y-1/2 pointer-events-none w-full px-3 py-2">
            <span className="invisible">{tempValue}</span>
            <span className="text-gray-400 font-normal">{completion}</span>
          </p>
        </div>
      </label>

      <div className="flex flex-wrap w-full text-sm">
        {values.map((instance) => (
          <div
            className={clsx([
              'flex items-center py-0.75 pl-2 pr-1.5 mr-2 mt-2 border rounded-sm cursor-pointer transition-all duration-300',
              'bg-gray-300 border-gray-500 text-gray-700 hover:bg-red-200 hover:border-red-800 hover:text-red-800',
            ])}
            onClick={() => removeValue(instance)}
            key={uuidv4()}
          >
            <p className="font-normal mr-1" key={uuidv4()}>
              {instance.name}
            </p>

            <XIcon className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
