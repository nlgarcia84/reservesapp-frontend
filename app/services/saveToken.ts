// Serveis para gestionar el token d'autenticació en localStorage
// Permet emmagatzemar, recuperar i esborrar les dades de sessió de l'usuari

// Claus per emmagatzemar les dades al localStorage del navegador
const TOKEN_KEY = 'auth_token'; // Clau per al token JWT
const ROLE_KEY = 'auth_role'; // Clau per al rol de l'usuari (ADMIN/EMPLOYEE)
const NAME_KEY = 'auth_name'; // Clau per al nom de l'usuari

// Funció per guardar el token, rol i nom en localStorage
// Aquestes dades persisteixen fins que l'usuari faci logout o esborri les cookies
export const saveToken = (token: string, role: string, name: string) => {
  // Emmagatzemem el token JWT
  localStorage.setItem(TOKEN_KEY, token);
  // Emmagatzemem el rol per saber si és admin o empleat
  localStorage.setItem(ROLE_KEY, role);
  // Emmagatzemem el nom per mostrar-lo en la interfície
  localStorage.setItem(NAME_KEY, name);
};

// Funció per obtenir el token emmagatzemat
// Retorna el token o null si no existeix
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Funció per obtenir el rol de l'usuari
// Retorna 'ADMIN' o 'EMPLOYEE' (o null si no existeix)
export const getRole = (): string | null => {
  return localStorage.getItem(ROLE_KEY);
};

// Funció per obtenir el nom de l'usuari
// Retorna el nom o null si no existeix
export const getName = (): string | null => {
  return localStorage.getItem(NAME_KEY);
};

// Funció per esborrar totes les dades de la sessió
// S'executa quan l'usuari fa logout
export const clearToken = () => {
  // Esborrem el token
  localStorage.removeItem(TOKEN_KEY);
  // Esborrem el rol
  localStorage.removeItem(ROLE_KEY);
  // Esborrem el nom
  localStorage.removeItem(NAME_KEY);
};
