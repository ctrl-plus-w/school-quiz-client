export const generatePassword = (passwordLength: number): string => {
  const password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return password.slice(0, passwordLength);
};
