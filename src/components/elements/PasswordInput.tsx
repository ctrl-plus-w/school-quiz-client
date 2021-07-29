import React, { ChangeEvent, MouseEvent, useState } from 'react';

import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

interface Props {
  placeholder?: string;
  label: string;

  className?: string;

  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordInput = ({ label, placeholder, className, value, setValue }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const switchPasswordVisibility = (e: MouseEvent) => {
    e.preventDefault();

    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`form-control flex flex-col w-full ${className}`}>
      <label className="text-sm font-semibold uppercase text-gray-900">
        {label}

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="block border border-gray-500 rounded-sm py-2 px-3 mt-2 outline-none focus:outline-none w-full"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />

          <button
            className=" absolute top-1/2 right-0 h-full px-2 transform -translate-y-1/2 flex justify-center items-center"
            onClick={switchPasswordVisibility}
          >
            {showPassword ? <EyeIcon className="h-5 w-5 text-gray-600" /> : <EyeOffIcon className="h-5 w-5 text-gray-600" />}
          </button>
        </div>
      </label>
    </div>
  );
};

export default PasswordInput;
