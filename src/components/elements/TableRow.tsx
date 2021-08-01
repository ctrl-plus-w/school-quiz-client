import React, { Dispatch, FormEvent, ReactElement, SetStateAction, useContext } from 'react';
import { useRouter } from 'next/dist/client/router';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import { TrashIcon } from '@heroicons/react/outline';

import Button from '@element/Button';
import Title from '@element/Title';

import useClickOutside from 'hooks/useClickOutside';
import database from 'database/database';
import { getHeaders } from '@util/authentication.utils';
import { AuthContext } from 'context/AuthContext/AuthContext';
import { AxiosError } from 'axios';
import { NotificationContext } from 'context/NotificationContext/NotificationContext';

type MapperFunction = (value: any) => string;

interface IProps<T, K> {
  instance: T;
  attributes: Array<[name: string, attribute: K, mapper?: MapperFunction]>;
  shownElement: number;
  apiName: string;
  setShownElement: Dispatch<SetStateAction<number>>;
}

const TableRow = <T extends { id: number }, K extends keyof T>({
  instance,
  attributes,
  shownElement,
  apiName,
  setShownElement,
}: IProps<T, K>): ReactElement => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);
  const { token } = useContext(AuthContext);

  const updateShownElement = () => {
    if (shownElement === instance.id) {
      setShownElement(-1);
    }
  };

  const { container } = useClickOutside<HTMLFormElement>(updateShownElement, [shownElement]);

  const handleClick = (instance: T): void => {
    router.push({ pathname: `${router.pathname}/[id]`, query: { id: instance.id } });
  };

  const handleDelete = () => {
    setShownElement(instance.id);
  };

  const deleteInstance = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const request = await database.delete(`/api/${apiName}/${instance.id}`, getHeaders(token));

      if (request.status === 200) {
        addNotification({ content: 'Élément supprimé !', type: 'INFO' });

        router.reload();
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
          onClick={() => handleClick(instance)}
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
            'error-validation z-10 absolute top-full -left-72 w-72 flex items-start shadow-xl flex-col py-5 px-4 bg-white rounded border border-gray-400 cursor-default',
            shownElement === instance.id ? 'visible' : 'invisible',
          ])}
          ref={container}
          onSubmit={deleteInstance}
        >
          <Title level={4}>Êtes vous sur ?</Title>

          <p className="text-gray-800 font-normal">Cette action est irréversible.</p>

          <Button full={false} color="red" className="mt-6" submit={true}>
            Supprimer
          </Button>
        </form>
      </td>
    </tr>
  );
};

export default TableRow;
