import React, { ChangeEvent } from 'react';

interface IProps {
  placeholder?: string;
  label: string;

  className?: string;

  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Input = ({ label, placeholder, className, value, setValue }: IProps) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  return (
    <div className={`form-control flex flex-col w-full ${className}`}>
      <label className="text-sm font-semibold uppercase text-gray-900">
        {label}

        <input
          type="text"
          className="block border border-gray-500 rounded-sm w-full py-2 px-3 mt-2 outline-none focus:outline-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default Input;
