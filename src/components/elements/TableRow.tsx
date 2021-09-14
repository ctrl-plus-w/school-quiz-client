import { useRouter } from 'next/dist/client/router';
import { v4 as uuidv4 } from 'uuid';

import type { Dispatch, FormEvent, ReactElement, SetStateAction } from 'react';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { useSelector } from 'react-redux';

import React from 'react';
import clsx from 'clsx';

import Button from '@element/Button';
import Title from '@element/Title';

import useClickOutside from '@hooks/useClickOutside';

import { selectToken } from '@redux/authSlice';

interface IProps<T, K> {
  instance: T;

  attributes: Array<[name: string, attribute: K, mapper?: MapperFunction]>;

  shownElement: number;
  setShownElement: Dispatch<SetStateAction<number>>;

  removeFromStore?: ActionCreatorWithPayload<any, any>;

  action?: RowAction<T>;

  handleClick?: (instance: T) => void;
}

const TableRow = <T extends { id: number }, K extends keyof T>({
  instance,
  attributes,
  shownElement,
  setShownElement,
  handleClick,
  action,
}: IProps<T, K>): ReactElement => {
  const router = useRouter();

  const token = useSelector(selectToken);

  const updateShownElement = () => {
    if (shownElement === instance.id) {
      setShownElement(-1);
    }
  };

  const { container } = useClickOutside<HTMLFormElement>(updateShownElement, [shownElement]);

  const defaultHandleClick = (instance: T): void => {
    router.push({ pathname: `${router.pathname}/[id]`, query: { id: instance.id } });
  };

  const handleShowValidation = (event: FormEvent) => {
    if (!action || action?.validate) {
      setShownElement(instance.id);
    } else {
      action.cb(event, instance);
    }
  };

  const handleActionClick = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) return;
    if (action) action.cb(e, instance);

    setShownElement(-1);
  };

  const getActionColor = (): string => {
    switch (action?.type) {
      case 'ERROR':
        return 'hover:bg-red-100';

      case 'INFO':
        return 'hover:bg-blue-100';

      case 'SUCCESS':
        return 'hover:bg-green-100';

      case 'WARNING':
        return 'hover:bg-yellow-100';

      default:
        return 'hover:bg-gray-100';
    }
  };
  return (
    <tr key={uuidv4()} className="group">
      {attributes.map(([_name, attribute, mapper]) => (
        <td
          className="px-4 py-3 cursor-pointer text-gray-500 text-sm border-t border-gray-300 group-hover:bg-gray-200 transition-all duration-100 overflow-hidden overflow-ellipsis"
          key={uuidv4()}
          onClick={() => (handleClick ? handleClick(instance) : defaultHandleClick(instance))}
        >
          {mapper ? mapper(instance[attribute]) : instance[attribute]}
        </td>
      ))}

      {action && (
        <td className="relative cursor-pointer w-6 text-gray-500 text-sm border-t border-gray-300 group-hover:bg-gray-200 transition-all duration-100">
          <div
            className={clsx(['relative py-3 flex justify-center items-center w-full transition-all duration-100', getActionColor()])}
            onClick={handleShowValidation}
          >
            {action.icon}
          </div>

          <form
            className={clsx([
              'error-validation z-10 w-72 flex items-start flex-col py-5 px-4 rounded border cursor-default',
              'absolute top-full -left-72',
              'bg-white border-gray-400 shadow-2xl',
              'ring ring-gray-300',
              shownElement === instance.id ? 'visible' : 'invisible',
            ])}
            ref={container}
            onSubmit={handleActionClick}
          >
            <Title level={4}>Êtes vous sur ?</Title>

            <p className="text-gray-800 font-normal">Cette action est irréversible.</p>

            <Button full={false} className="mt-6" submit={true} type={action ? action.type.toLowerCase() : 'error'}>
              {action.validateButton || 'Valider'}
            </Button>
          </form>
        </td>
      )}
    </tr>
  );
};

export default TableRow;
