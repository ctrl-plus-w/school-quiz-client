import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { XIcon } from '@heroicons/react/outline';
import Helper from './Helper';

interface IProps<T extends IBasicModel> {
  label: string;
  placeholder: string;

  className?: string;

  children?: React.ReactNode;

  data: Array<T>;

  values: Array<T>;
  addValue: (instance: T) => void;
  removeValue: (instance: T) => void;
}

const TagsInput = <T extends IBasicModel>({ className, label, placeholder, values, addValue, removeValue, data }: IProps<T>) => {
  const [tempValue, setTempValue] = useState('');
  const [completion, setCompletion] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleInput = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== 'Enter') return;

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
    <div className={`form-control flex flex-col w-80 ${className}`}>
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

        <div className="flex border border-gray-500 rounded-sm w-full mt-2 pl-1">
          {values.map((instance) => (
            <div
              className="flex items-center py-0.75 pl-2 pr-1.5 my-1 mr-1 bg-gray-300 border border-gray-500 rounded-sm cursor-pointer"
              onClick={() => removeValue(instance)}
              key={uuidv4()}
            >
              <p className="text-gray-700 font-normal mr-1" key={uuidv4()}>
                {instance.name}
              </p>

              <XIcon className="h-4 w-4 text-gray-700" />
            </div>
          ))}

          <div className="relative w-full border border-transparent pr-2">
            <input
              type="text"
              className={`${isValid ? 'text-green-600' : ''} appearance-none outline-none w-full py-1.75 ${values.length ? 'ml-1' : 'ml-2'}`}
              placeholder={placeholder}
              onKeyDown={handleInput}
              value={tempValue}
              onChange={onChange}
            />

            <p className={`absolute top-1/2 left-0 transform -translate-y-1/2 pointer-events-none ${values.length ? 'ml-1' : 'ml-2'}`}>
              <span className="invisible">{tempValue}</span>
              <span className="text-gray-400 font-normal">{completion}</span>
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default TagsInput;
