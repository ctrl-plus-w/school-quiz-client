import { deleteApiCall, getApiCall, postApiCall, updateApiCall } from '@api/index';

export const getEvents = async (userId: number, token: string): Promise<APIResponse<Array<IEvent>>> => {
  const endpoint = `/api/users/${userId}/events`;
  return getApiCall(endpoint, token);
};

export const getEvent = async (eventId: number, token: string, userId?: number): Promise<APIResponse<IEvent>> => {
  const endpoint = userId ? `/api/users/${userId}/events/${eventId}` : `/api/events/${eventId}`;
  return getApiCall(endpoint, token, { errors: { '404': "L'événement n'a pas été trouvé." } });
};

export const getStudentEvent = async (token: string): Promise<APIResponse<IEvent>> => {
  const endpoint = '/api/events/event';
  return getApiCall(endpoint, token, { errors: { '404': "L'événement n'a pas été trouvé." } });
};

export const createEvent = async (creationAttributes: EventCreationAttributes, token: string): Promise<APIResponse<IEvent>> => {
  const endpoint = '/api/events';
  return postApiCall(endpoint, token, { data: creationAttributes, errors: { '409': 'Cet événement existe déja.' } });
};

export const updateEvent = async (
  eventId: number,
  updateAttributes: AllOptional<EventCreationAttributes>,
  token: string
): Promise<APIResponse<UpdateResponse>> => {
  const endpoint = `/api/events/${eventId}`;
  return updateApiCall(endpoint, token, { data: updateAttributes, errors: { '404': "Cet événement n'existe pas ." } });
};

export const addCollaborators = async (eventId: number, userIds: Array<number>, token: string): Promise<APIResponse<UpdateResponse>> => {
  const endpoint = `/api/events/${eventId}/collaborators`;
  return postApiCall(endpoint, token, { data: { userIds }, errors: { '409': 'Un des collaborateurs existe déja.' } });
};

export const removeCollaborators = async (eventId: number, userIds: Array<number>, token: string): Promise<APIResponse<DeleteResponse>> => {
  const endpoint = `/api/events/${eventId}/collaborators`;
  return deleteApiCall(endpoint, token, { data: userIds, errors: { '409': 'Un des collaborateurs existe déjà.' } });
};
