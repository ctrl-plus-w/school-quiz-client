import { FunctionComponent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import React from 'react';
import clsx from 'clsx';

import { ChevronDownIcon } from '@heroicons/react/outline';

import useClickOutside from '@hooks/useClickOutside';

interface IProps {
  placeholder: string;
  label: string;

  readonly?: boolean;

  className?: string;

  values: Array<{ name: string; slug: string }>;
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}

const Dropdown: FunctionComponent<IProps> = ({ className, label, placeholder = 'Dropdown', values, value, setValue, readonly }: IProps) => {
  const [isHidden, setHidden] = useState(true);

  const onChange = (slug: string): void => {
    if (readonly) return;

    setValue(slug);
    closeDropdown();
  };

  const closeDropdown = (): void => {
    setHidden(true);
  };

  const switchState = (): void => {
    !readonly && setHidden((prev) => !prev);
  };

  const handleClickOutside = (): void => {
    if (!isHidden) setHidden(true);
  };

  const { container } = useClickOutside<HTMLDivElement>(handleClickOutside);

  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <label className="relative text-sm font-semibold text-gray-900">
        <div className="uppercase">
          <p>{label}</p>
        </div>

        <div className={clsx(['relative', readonly ? 'cursor-not-allowed' : 'cursor-pointer'])} ref={container}>
          <div
            className={clsx([
              'form-input--nb border',
              !readonly ? (isHidden ? 'border-gray-500' : 'border-blue-600 ring ring-blue-200') : 'border-gray-500 hover:border-red-600',
            ])}
            onClick={switchState}
          >
            <p className={clsx([value === '' || value === null ? 'text-gray-600' : 'text-black', 'font-normal'])}>
              {value ? values.find(({ slug }) => slug === value)?.name : placeholder}
            </p>

            <div className="absolute top-1/2 right-0 h-full px-2.5 transform -translate-y-1/2 flex justify-center items-center pointer-events-none">
              <ChevronDownIcon className={clsx(['h-5 w-5 text-gray-600 transition-all duration-300', isHidden && 'transform rotate-90'])} />
            </div>
          </div>

          {isHidden ? null : (
            <div className="z-30 absolute top-full left-0 bg-white border border-t-0 border-gray-500 rounded-sm rounded-t-none w-full shadow-lg">
              {values.map(({ name, slug }) => (
                <div className="group rounded-sm w-full py-1 px-1" onClick={() => onChange(slug)} key={uuidv4()}>
                  <p className="text-gray-600 font-normal text-sm py-1 px-2 rounded-sm group-hover:bg-gray-200 transition-all duration-300">{name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default Dropdown;
