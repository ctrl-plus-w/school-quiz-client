import { useRouter } from 'next/dist/client/router';
import { v4 as uuidv4 } from 'uuid';
import { useContext } from 'react';

import type { Dispatch, FormEvent, ReactElement, SetStateAction } from 'react';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';

import { useSelector } from 'react-redux';

import React from 'react';
import clsx from 'clsx';

import { TrashIcon } from '@heroicons/react/outline';

import Button from '@element/Button';
import Title from '@element/Title';

import useAppDispatch from '@hooks/useAppDispatch';
import useClickOutside from '@hooks/useClickOutside';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import { NotificationContext } from '@notificationContext/NotificationContext';

import { selectToken } from '@redux/authSlice';

interface IProps<T, K> {
  instance: T;

  apiName: string;

  attributes: Array<[name: string, attribute: K, mapper?: MapperFunction]>;

  shownElement: number;
  setShownElement: Dispatch<SetStateAction<number>>;

  removeFromStore?: ActionCreatorWithPayload<any, any>;

  handleClick?: (instance: T) => void;
}

const TableRow = <T extends { id: number }, K extends keyof T>({
  instance,
  attributes,
  shownElement,
  apiName,
  setShownElement,
  handleClick,
  removeFromStore,
}: IProps<T, K>): ReactElement => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const token = useSelector(selectToken);

  const { addNotification } = useContext(NotificationContext);

  const updateShownElement = () => {
    if (shownElement === instance.id) {
      setShownElement(-1);
    }
  };

  const { container } = useClickOutside<HTMLFormElement>(updateShownElement, [shownElement]);

  const defaultHandleClick = (instance: T): void => {
    router.push({ pathname: `${router.pathname}/[id]`, query: { id: instance.id } });
  };

  const handleDelete = () => {
    setShownElement(instance.id);
  };

  const deleteInstance = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) return;

    try {
      const request = await database.delete(`/api/${apiName}/${instance.id}`, getHeaders(token));

      if (request.status === 200) {
        addNotification({ content: 'Élément supprimé !', type: 'INFO' });

        if (removeFromStore) dispatch(removeFromStore(instance.id));
        else router.reload();
      }
    } catch (_err: any) {
      const err = _err as AxiosError;

      if (!err.response) {
        addNotification({ content: 'Une erreur est survenue.', type: 'ERROR' });
        return;
      }

      if (err.response.status === 404) addNotification({ content: 'Élément non trouvé.', type: 'ERROR' });

      if (err.response.status === 403) return router.push('/login');
    } finally {
      setShownElement(-1);
    }
  };

  return (
    <tr key={uuidv4()} className="group">
      {attributes.map(([_name, attribute, mapper]) => (
        <td
          className="px-4 py-3 cursor-pointer text-gray-500 text-sm border-t border-gray-300 group-hover:bg-gray-200 transition-all duration-100"
          key={uuidv4()}
          onClick={() => (handleClick ? handleClick(instance) : defaultHandleClick(instance))}
        >
          {mapper ? mapper(instance[attribute]) : instance[attribute]}
        </td>
      ))}

      <td className="relative cursor-pointer w-6 text-gray-500 text-sm border-t border-gray-300 group-hover:bg-gray-200 transition-all duration-100">
        <div className="relative py-3 flex justify-center items-center w-full hover:bg-red-100 transition-all duration-100" onClick={handleDelete}>
          <TrashIcon className="text-red-500 w-5 h-5" />
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
          onSubmit={deleteInstance}
        >
          <Title level={4}>Êtes vous sur ?</Title>

          <p className="text-gray-800 font-normal">Cette action est irréversible.</p>

          <Button full={false} className="mt-6" submit={true} type="error">
            Supprimer
          </Button>
        </form>
      </td>
    </tr>
  );
};

export default TableRow;
