import React, { FunctionComponent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ChevronDownIcon } from '@heroicons/react/outline';

interface IProps {
  placeholder: string;
  label: string;

  className?: string;

  values: Array<{ name: string; slug: string }>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Dropdown: FunctionComponent<IProps> = ({ className, label, placeholder = 'Dropdown', values, value, setValue }: IProps) => {
  const [isHidden, setHidden] = useState(true);

  const onChange = (slug: string): void => {
    setValue(slug);
    closeDropdown();
  };

  const closeDropdown = (): void => {
    setHidden(true);
  };

  const switchState = (): void => {
    setHidden((prev) => !prev);
  };

  return (
    <div className={`form-control flex flex-col w-80 ${className}`}>
      <label className="relative text-sm font-semibold uppercase text-gray-900">
        {label}

        <div className="relative">
          <div className="z-50 relative border border-gray-500 rounded-sm w-full py-2 px-3 mt-2 cursor-pointer" onClick={switchState}>
            <p className={`${value === '' || value === null ? 'text-gray-600' : 'text-black'} font-normal capitalize`}>
              {value ? value : placeholder}
            </p>

            <div className=" absolute top-1/2 right-0 h-full px-2.5 transform -translate-y-1/2 flex justify-center items-center pointer-events-none">
              <ChevronDownIcon className={`h-5 w-5 text-gray-600 ${isHidden ? '' : 'transform rotate-90'} transition-all duration-300`} />
            </div>
          </div>

          {isHidden ? null : (
            <div className="z-40 absolute top-full left-0 bg-white border border-t-0 border-gray-500 rounded-sm rounded-t-none w-full pt-2 -mt-2">
              {values.map(({ name, slug }) => (
                <div className="group rounded-sm w-full py-1 px-1 cursor-pointer" onClick={() => onChange(slug)} key={uuidv4()}>
                  <p className="text-gray-600 font-normal text-sm capitalize py-1 px-2 rounded-sm group-hover:bg-gray-200 transition-all duration-300">
                    {name}
                  </p>
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
