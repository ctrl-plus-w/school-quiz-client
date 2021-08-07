import React, { ChangeEvent, FunctionComponent, MouseEvent, useState } from 'react';

import clsx from 'clsx';

import { EyeIcon, EyeOffIcon, CogIcon } from '@heroicons/react/outline';

import { generatePassword } from '@util/generate.utils';

import PASSWORD from '@constant/password';

interface IProps {
  placeholder?: string;
  label: string;
  note?: string;

  className?: string;

  generator?: boolean;

  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordInput: FunctionComponent<IProps> = ({ label, placeholder, className, value, setValue, note, generator = false }: IProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const switchPasswordVisibility = (e: MouseEvent) => {
    e.preventDefault();

    setShowPassword((prev) => !prev);
  };

  const setPassword = (e: MouseEvent): void => {
    e.preventDefault();

    const password = generatePassword(PASSWORD.PASSWORD_LENGTH);
    setValue(password);
  };

  return (
    <div className={clsx(['form-control flex flex-col w-full', className])}>
      <label className="text-sm font-semibold text-gray-900">
        <div className="flex items-center">
          <p className="uppercase mr-2">{label}</p>

          {generator && <CogIcon className="h-4 w-4 cursor-pointer hover:text-blue-500 transition duration-300" onClick={setPassword} />}
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="block border border-gray-500 rounded-sm py-2 px-3 mt-2 outline-none focus:outline-none w-full"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />

          <div
            className=" absolute top-1/2 right-0 h-full px-2.5 transform -translate-y-1/2 flex justify-center items-center cursor-pointer"
            onClick={switchPasswordVisibility}
          >
            {showPassword ? <EyeIcon className="h-5 w-5 text-gray-600" /> : <EyeOffIcon className="h-5 w-5 text-gray-600" />}
          </div>
        </div>

        {note && (
          <div className="w-full mt-0.5">
            <small className="text-gray-600 text-xs font-medium italic">{note}</small>
          </div>
        )}
      </label>
    </div>
  );
};

export default PasswordInput;
