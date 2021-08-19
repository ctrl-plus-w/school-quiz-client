import { AxiosError } from 'axios';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

const DEFAULT_API_ERROR_RESPONSE: APIResponse<null> = [null, { status: 400, message: 'Une erreur est survenue ' }];

export const getEvents = async (token: string): Promise<APIResponse<Array<IEvent>>> => {
  try {
    const { data: events } = await database.get('/api/events', getHeaders(token));

    return [events, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const getEvent = async (eventId: number, token: string, userId?: number): Promise<APIResponse<IEvent>> => {
  try {
    const { data: event } = await database.get(userId ? `/api/users/${userId}/events/${eventId}` : `/api/events/${eventId}`, getHeaders(token));

    return [event, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 404) return [null, { status: 404, message: "L'événement n'a pas été trouvé !" }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const createEvent = async (creationAttributes: EventCreationAttributes, token: string): Promise<APIResponse<IEvent>> => {
  try {
    const { data: event } = await database.post('/api/events', creationAttributes, getHeaders(token));

    return [event, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Cet événement existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const addCollaborators = async (eventId: number, userIds: Array<number>, token: string): Promise<APIResponse<UpdateResponse>> => {
  try {
    const { data: updated } = await database.post(`/api/events/${eventId}/collaborators`, { userIds }, getHeaders(token));

    return [updated, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Un des collaborateurs existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const removeCollaborators = async (eventId: number, userIds: Array<number>, token: string): Promise<APIResponse<RemoveResponse>> => {
  try {
    for (const userId of userIds) {
      await database.delete(`/api/events/${eventId}/collaborators/${userId}`, getHeaders(token));
    }

    return [{ removed: true }, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Un des collaborateurs existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};
