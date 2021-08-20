import { ChangeEvent, Dispatch, KeyboardEvent, MouseEvent, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import React from 'react';
import clsx from 'clsx';

import { XIcon } from '@heroicons/react/outline';

import useClickOutside from '@hooks/useClickOutside';

interface IProps {
  className?: string;

  label: string;
  data: Array<{ name: string; slug: string }>;
  placeholder?: string;
  errorMessage?: string;
  maxResults?: number;
  disabled?: boolean;

  values: Array<{ name: string; slug: string }>;
  setValues: Dispatch<SetStateAction<Array<{ name: string; slug: string }>>>;

  readonly?: boolean;
}

const SearchInput = ({
  label,
  placeholder = 'Rechercher...',
  errorMessage = 'Aucune donnée trouvée...',
  maxResults = 7,
  className,
  readonly = false,
  disabled = false,
  data,
  values,
  setValues,
}: IProps): ReactElement => {
  const [hidden, setHidden] = useState(true);
  const [value, setValue] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const newFilteredData = data
      .filter((el) => el.name.toLowerCase().startsWith(value.toLowerCase()))
      .filter((el) => !values.some(({ name }) => name === el.name))
      .slice(0, maxResults);

    setFilteredData(newFilteredData);
  }, [maxResults, value, values, data]);

  useEffect(() => {
    setNoData(data.filter((el) => !values.some(({ name }) => name === el.name)).length === 0 ? true : false);
  }, [data, values]);

  const handleClickOutside = (): void => {
    if (!hidden) setHidden(true);
  };

  const { container } = useClickOutside<HTMLDivElement>(handleClickOutside);

  const handleLabelClick = (e: MouseEvent<HTMLLabelElement>) => {
    const target = e.target as Element;
    if (!Array.from(target.classList).includes('label')) e.preventDefault();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    if (filteredData.length === 0) return;

    addValue(filteredData[0]);
  };

  const addValue = (instance: { name: string; slug: string }): void => {
    if (readonly) return;

    if (!instance || values.includes(instance)) return;

    setValues((prev) => [...prev, instance]);
    setValue('');
    setHidden(true);
  };

  const removeValue = (instance: { name: string; slug: string }): void => {
    if (readonly) return;

    if (!instance || !values.includes(instance)) return;

    setValues((prev) => prev.filter((el) => el !== instance));
  };

  const handleFocus = (): void => {
    setHidden(false);
  };

  // ! The label click event is prevented unless the click is on the real text label, otherwise,
  // ! when clicking on a dropdown element, the input refocus and the dropdown never hide.

  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <label className="relative text-sm font-semibold text-gray-900" onClick={handleLabelClick}>
        <div className="uppercase">
          <p className="label pb-2">{label}</p>
        </div>

        <div className={clsx(['relative', readonly ? 'cursor-not-allowed' : 'cursor-pointer'])} ref={container}>
          <input
            type="text"
            placeholder={noData ? errorMessage : placeholder}
            className="form-input--nm"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleInputKeydown}
            onFocus={handleFocus}
            disabled={noData || disabled}
          />

          {hidden || filteredData.length === 0 ? null : (
            <div className="z-30 absolute top-full left-0 bg-white border border-t-0 border-gray-500 rounded-sm rounded-t-none w-full cursor-pointer">
              {filteredData.map((instance) => (
                <div className="group rounded-sm w-full py-1 px-1" onClick={() => addValue(instance)} key={uuidv4()}>
                  <p className="text-gray-600 font-normal text-sm py-1 px-2 rounded-sm group-hover:bg-gray-200 transition-all duration-300">
                    {instance.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </label>

      <div className="flex flex-col gap-2 justify-center text-sm text-gray-600 pt-2">
        {values.map((instance) => {
          return (
            <div className="flex justify-between bg-gray-200 border border-gray-500 rounded-sm" key={uuidv4()}>
              <p className="px-2 py-1">{instance.name}</p>

              {!disabled && (
                <button className="px-2 py-1" onClick={() => removeValue(instance)}>
                  <XIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchInput;
