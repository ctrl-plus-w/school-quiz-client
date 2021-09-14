import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

import type { PayloadActionCreator } from '@reduxjs/toolkit';
import type { FormEvent, ReactElement } from 'react';
import type { AxiosError } from 'axios';

import React from 'react';
import clsx from 'clsx';

import { TrashIcon } from '@heroicons/react/outline';

import TableRow from '@element/TableRow';
import database from '@database/database';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getHeaders } from '@util/authentication.utils';

import { addErrorNotification, addSuccessNotification } from '@redux/notificationSlice';
import { selectToken } from '@redux/authSlice';

type DeleteRowAction = {
  apiName: string;
  removeFromStoreReducer: PayloadActionCreator<any, any>;
};

interface IProps<T, K> {
  data: Array<T>;
  attributes: Array<[name: string, attribute: K, mapper?: MapperFunction]>;

  action?: RowAction<T>;
  deleteAction?: DeleteRowAction;

  handleClick?: (instance: T) => void;
}

const Table = <T extends { id: number }, K extends keyof T>({ attributes, data, action, deleteAction, handleClick }: IProps<T, K>): ReactElement => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [shownElement, setShownElement] = useState(-1);

  const token = useAppSelector(selectToken);

  const deleteInstance = async (_event: FormEvent, instance: T) => {
    if (!deleteAction || !token) return;

    try {
      const request = await database.delete(`/api/${deleteAction.apiName}/${instance.id}`, getHeaders(token));

      if (request.status === 200) {
        dispatch(addSuccessNotification('Élément supprimé !'));
        if (deleteAction.removeFromStoreReducer) dispatch(deleteAction.removeFromStoreReducer(instance.id));
        else router.reload();
      }
    } catch (_err: any) {
      const err = _err as AxiosError;
      if (!err.response) {
        dispatch(addErrorNotification('Une erreur est survenue.'));
        return;
      }

      if (err.response.status === 404) dispatch(addErrorNotification("Cet élément n'existe pas."));
      if (err.response.status === 403) router.push('/login');
    }
  };

  const getActionObject = (): RowAction<T> | undefined => {
    if (!action && !deleteAction) return undefined;

    if (deleteAction)
      return {
        type: 'ERROR',

        icon: <TrashIcon className="text-red-500 w-5 h-5" />,

        validate: true,
        validateButton: 'Supprimer',

        cb: deleteInstance,
      };

    return action;
  };

  return data.length > 0 ? (
    <table className="table-fixed w-full mt-14 whitespace-nowrap">
      <thead>
        <tr>
          {attributes.map(([name, slug]) => (
            <td
              className={clsx(['px-4 py-3 text-black border-t border-gray-300 text-sm overflow-hidden overflow-ellipsis'], slug === 'id' && 'w-2/24')}
              key={uuidv4()}
            >
              {name}
            </td>
          ))}

          {(action || deleteAction) && <td className="w-2/24 px-4 py-3 text-black border-t border-gray-300 text-sm"></td>}
        </tr>
      </thead>

      <tbody>
        {data.map((instance) => (
          <TableRow<T, K>
            instance={instance}
            attributes={attributes}
            key={uuidv4()}
            shownElement={shownElement}
            setShownElement={setShownElement}
            handleClick={handleClick}
            action={getActionObject()}
          />
        ))}
      </tbody>
    </table>
  ) : (
    <div className="flex flex-col w-full h-full mt-14">
      <hr />
      <p className="text-gray-500 text-base font-regular m-auto">Aucune donnée trouvée...</p>
    </div>
  );
};

export default Table;
