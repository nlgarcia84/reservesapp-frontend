const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'auth_role';
const NAME_KEY = 'auth_name';

export const saveToken = (token: string, role: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRole = (): string | null => {
  return localStorage.getItem(ROLE_KEY);
};

export const getName = (): string | null => {
  return localStorage.getItem(NAME_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};
