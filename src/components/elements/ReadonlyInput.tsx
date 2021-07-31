import React, { ReactElement } from 'react';

interface IProps {
  placeholder?: string;
  label: string;

  className?: string;
  value: string;
}

const ReadOnlyInput = ({ label, placeholder, className, value }: IProps): ReactElement => {
  return (
    <div className={`form-control flex flex-col w-80 ${className}`}>
      <label className="text-sm font-semibold uppercase text-gray-900">
        {label}

        <input
          type="text"
          className="block border border-gray-500 rounded-sm w-full py-2 px-3 mt-2 outline-none focus:outline-none"
          placeholder={placeholder}
          value={value}
          readOnly={true}
        />
      </label>
    </div>
  );
};

export default ReadOnlyInput;
