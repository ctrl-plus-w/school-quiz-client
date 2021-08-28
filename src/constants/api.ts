const API = {
  DEFAULT_ERROR: 'Une erreur est survenue.',
  DEFAULT_FORBIDDEN_ERROR: "Vous n'êtes pas autorisé à faire ceci.",
};

export default API;

export enum METHODS {
  POST,
  GET,
  UPDATE,
}

export enum ERRORS {
  DEFAULT = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
}
