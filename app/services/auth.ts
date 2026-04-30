/* eslint-disable @typescript-eslint/no-unused-vars */
// Serveis d'autenticació del frontend
// Maneig de login, registre i peticions protegides amb JWT

import { getToken, clearToken } from './saveToken';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tipus de resposta d'autenticació que rebem del backend
// Inclou el token JWT, el rol de l'usuari i el seu nom
export type AuthResponse = {
  token: string; // JWT token per a peticions protegides
  role: 'ADMIN' | 'EMPLOYEE'; // Rol de l'usuari (administrador o empleat)
  name: string; // Nom de l'usuari
  id: number; // ID de l'usuari
};

// Funció de login: envia les credencials (email i contrasenya) al servidor
// Retorna les dades de l'usuari i el token JWT si l'autenticació és correcta
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean = false,
): Promise<AuthResponse> => {
  // Enviem una petició POST al backend amb les credencials de l'usuari
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  // Llegim la resposta del servidor com a text per poder processar-la
  const responseText = await res.text();

  // Si la resposta no és correcta (status != 200), llancem un error
  if (!res.ok) {
    let errorMessage = `Error de login (Status: ${res.status})`;
    try {
      // Intentem extraure el missatge d'error del JSON del servidor
      if (responseText) {
        const err = JSON.parse(responseText);
        errorMessage = err.message || errorMessage;
      }
    } catch {
      // Si no és JSON, usem el text com a error
      errorMessage = responseText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Si tot va bé, retornem les dades (token, role, name)
  return JSON.parse(responseText);
};

// Funció de registre: crea un nou usuari amb el seu email, nom i contrasenya
// El backend retorna les dades del nou usuari amb token JWT
export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  // Enviem una petició POST al backend amb les dades del nou usuari
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  // Si la resposta no és correcta, mostrem un error
  if (!res.ok) {
    let errorMessage = 'Error de registre';
    try {
      // Intentem obtenir el missatge d'error del servidor
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  // Retornem les dades de l'usuari registrat
  return res.json();
};

// Funció per fer peticions protegides amb autenticació JWT
// Afegeix automàticament el token JWT al header 'Authorization: Bearer {token}'
// S'usa per accedir a recursos que necessiten autenticació
export const fetchProtected = async (
  url: string,
  options: RequestInit = {},
): Promise<AuthResponse> => {
  // Obtenim el token emmagatzemat al localStorage
  const token = getToken();

  // Si no hi ha token, no podem fer la petició protegida
  if (!token) {
    throw new Error('No hi ha token');
  }

  // Fem la petició al servidor afegint el token al header Authorization
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Token JWT en format estàndard
      ...options.headers,
    },
  });

  // Si la resposta no és correcta, llancem un error
  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }

  // Retornem els dades de la resposta
  return res.json();
};

// Funció de logout: destrueix la sessió de l'usuari
// Esborra el token del localStorage i redirigeix a la pàgina de login
export const logout = () => {
  // Esborrem tots els dades d'autenticació emmagatzemades (token, rol, nom)
  clearToken();

  // Netegem sessionStorage per si de cas
  try {
    sessionStorage.clear();
  } catch (e) {
    // Ignorar errors
  }

  // Disparem un event de storage per sincronitzar els altres tabs
  window.dispatchEvent(new Event('storage'));

  // Fem reload complet (no cache) per assegurar que tot l'estat s'ha reinicialitzat
  // location.href força reload des del servidor
  setTimeout(() => {
    // Forçar reload sense cache
    window.location.href = '/login?' + Date.now();
  }, 100);
};
