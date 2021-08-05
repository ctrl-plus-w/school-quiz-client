import React, { FunctionComponent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ChevronDownIcon } from '@heroicons/react/outline';

import useClickOutside from 'hooks/useClickOutside';
import clsx from 'clsx';

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
    <div className={`form-control flex flex-col w-80 ${className}`}>
      <label className="relative text-sm font-semibold text-gray-900">
        <div className="uppercase">
          <p>{label}</p>
        </div>

        <div className={clsx(['relative', readonly ? 'cursor-not-allowed' : 'cursor-pointer'])} ref={container}>
          <div className="z-20 relative border border-gray-500 rounded-sm w-full py-2 px-3 mt-2" onClick={switchState}>
            <p className={`${value === '' || value === null ? 'text-gray-600' : 'text-black'} font-normal`}>
              {value ? values.find(({ slug }) => slug === value)?.name : placeholder}
            </p>

            <div className=" absolute top-1/2 right-0 h-full px-2.5 transform -translate-y-1/2 flex justify-center items-center pointer-events-none">
              <ChevronDownIcon className={`h-5 w-5 text-gray-600 ${isHidden ? '' : 'transform rotate-90'} transition-all duration-300`} />
            </div>
          </div>

          {isHidden ? null : (
            <div className="z-30 absolute top-full left-0 bg-white border border-t-0 border-gray-500 rounded-sm rounded-t-none w-full pt-2">
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
