import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

import type { Dispatch, ReactElement, SetStateAction } from 'react';

import React from 'react';
import clsx from 'clsx';

import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/outline';

import useClickOutside from '@hooks/useClickOutside';

import {
  formatDate,
  getCalendarDates,
  incrementMonth,
  incrementYear,
  isDateInMonth,
  isInFuture,
  isSameDate,
  monthToString,
  setDate,
} from '@util/date.utils';
import { areDatesEquals } from '@util/condition.utils';
import { sliceArray } from '@util/array.utils';

import { DAYS } from '@constant/date';

interface ICellProps {
  currentDate: Date;
  cellDate: Date;

  onlyFuture: boolean;

  currentClickable?: boolean;

  handleClick: (date: Date) => void;
}

const Cell = ({ currentDate, cellDate, onlyFuture, handleClick, currentClickable }: ICellProps): ReactElement => {
  const defaultClasses = useState('flex justify-center items-center border border-transparent rounded-sm flex-grow w-10 py-1 ');

  if (areDatesEquals(currentDate, cellDate)) {
    return (
      <div
        className={clsx([defaultClasses, 'bg-blue-600 text-white', currentClickable && 'cursor-pointer'])}
        onClick={() => currentClickable && handleClick(cellDate)}
      >
        <p>{cellDate.getDate()}</p>
      </div>
    );
  }

  if (onlyFuture && !isInFuture(cellDate)) {
    return (
      <div
        className={clsx([
          defaultClasses,
          'cursor-not-allowed',
          isSameDate(new Date(), cellDate) ? 'bg-gray-400 text-gray-700' : 'bg-gray-100 text-gray-400',
        ])}
      >
        {cellDate.getDate()}
      </div>
    );
  }

  if (isSameDate(new Date(), cellDate)) {
    return (
      <div className={clsx([defaultClasses, 'cursor-pointer bg-gray-400 text-gray-700'])} onClick={handleClick.bind(this, cellDate)}>
        {cellDate.getDate()}
      </div>
    );
  }

  return (
    <div
      className={clsx([
        defaultClasses,
        'cursor-pointer',
        isDateInMonth(currentDate, cellDate) ? 'bg-gray-200 text-gray-700 hover:border-gray-500' : 'bg-gray-100 text-gray-400 hover:border-gray-400',
      ])}
      onClick={handleClick.bind(this, cellDate)}
    >
      {cellDate.getDate()}
    </div>
  );
};

interface IProps {
  label: string;

  onlyFuture?: boolean;

  children?: ReactElement;
  className?: string;
  readonly?: boolean;
  currentClickable?: boolean;

  value: Date;
  setValue: Dispatch<SetStateAction<Date>>;

  cb?: (date: Date) => void;
}

const BTN_CLASSNAME = 'p-2 hover:text-blue-600 transform active:scale-75 transition-all duration-300';

const CalendarInput = ({
  label,
  className,
  children,
  value,
  setValue,
  cb,
  onlyFuture = false,
  readonly = false,
  currentClickable = false,
}: IProps): ReactElement => {
  const [hidden, setHidden] = useState(true);

  const { container } = useClickOutside<HTMLDivElement>(() => setHidden(true));

  const handleClick = (day: Date) => {
    setValue(day);
    setHidden(true);

    cb && cb(day);
  };

  return (
    <div className={clsx(['relative form-control flex flex-col w-80 text-sm', className])} ref={container}>
      <label className="font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <div
          className={clsx(['form-input', !hidden && 'focus', readonly ? 'cursor-not-allowed' : 'cursor-pointer'])}
          onClick={() => !readonly && setHidden((prev) => !prev)}
        >
          <p className="font-normal text-sm">{formatDate(value)}</p>
        </div>
      </label>

      {!hidden && !readonly && (
        <div className="absolute bottom-0 transform translate-y-full pt-6 ">
          <div className="flex flex-col p-4 border border-gray-300 rounded ring ring-gray-200 bg-white shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <div className="flex">
                <button className={BTN_CLASSNAME} type="button" onClick={() => setValue((prev) => setDate(incrementYear(prev, -1), 1))}>
                  <ChevronDoubleLeftIcon className="w-5 h-5" />
                </button>

                <button className={BTN_CLASSNAME} type="button" onClick={() => setValue((prev) => setDate(incrementMonth(prev, -1), 1))}>
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-900 font-semibold py-2">
                {monthToString(value.getMonth())} {value.getFullYear()}
              </p>

              <div className="flex">
                <button className={BTN_CLASSNAME} type="button" onClick={() => setValue((prev) => setDate(incrementMonth(prev, 1), 1))}>
                  <ChevronRightIcon className="w-5 h-5 " />
                </button>

                <button className={BTN_CLASSNAME} type="button" onClick={() => setValue((prev) => setDate(incrementYear(prev, 1), 1))}>
                  <ChevronDoubleRightIcon className="w-5 h-5 " />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-row flex-nowrap gap-1 text-gray-400">
                {DAYS.map((day) => (
                  <div className="flex justify-center w-10 py-1 flex-1" key={uuidv4()}>
                    <p>{day.slice(0, 2)}</p>
                  </div>
                ))}
              </div>

              {sliceArray(getCalendarDates(value), 7).map((chunk) => (
                <div className="flex flex-row flex-nowrap gap-1" key={uuidv4()}>
                  {chunk.map((day) => (
                    <Cell
                      currentDate={value}
                      cellDate={day}
                      onlyFuture={onlyFuture}
                      currentClickable={currentClickable}
                      handleClick={handleClick}
                      key={uuidv4()}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default CalendarInput;
