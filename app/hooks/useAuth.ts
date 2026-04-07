'use client';

import { useEffect, useState } from 'react';
import {
  getToken,
  getRole,
  getName,
  isTokenExpired,
  clearToken,
} from '@/app/services/saveToken';

/**
 * Hook useAuth - Gestiona l'autenticació de l'usuari
 *
 * RESPONSABILITATS:
 * 1. Llegir el token JWT del localStorage al cargar la pàgina
 * 2. Verificar que el token no ha expirat
 * 3. Mantenir sincronitzada la sessió entre pestanyes (storage events)
 * 4. Retornar l'estat d'autenticació (token, rol, nom, isAuthenticated)
 *
 * FLUX DE FUNCIONAMENT:
 * 1. Inicialització sincrònica: Llegeix localStorage sense SSR errors
 * 2. useEffect: Verifica el token i configura el listener de storage events
 * 3. Storage event listener: Sincronitza si es fa logout en altra pestanya
 *
 * RETORNA: { token, role, name, isAuthenticated }
 */
export const useAuth = () => {
  // Estado per emmagatzemar les dades d'autenticació de l'usuari
  // Inicialitzem sincronament per evitar hidratació missmatched entre servidor i client
  const [auth, setAuth] = useState(() => {
    // IMPORTANT: Comprovar si estem en SSR (servidor)
    // En SSR no tenim accés a localStorage
    if (typeof window === 'undefined') {
      // Retornem estat buit per a servidor
      return {
        token: null as string | null,
        role: null as string | null,
        name: null as string | null,
        isAuthenticated: false,
      };
    }

    // Si estem al CLIENT, llegim els valors de localStorage
    const token = getToken();

    // SEGURETAT: Verificar si el token JWT ha expirat
    // Decodifiquem el JWT i comparem l'exp amb l'hora actual
    if (token && isTokenExpired(token)) {
      // Si el token ha expirat, BORREM tota la sessió
      clearToken();
      return {
        token: null,
        role: null,
        name: null,
        isAuthenticated: false,
      };
    }

    // Si el token és vàlid, retornem l'autenticació read del localStorage
    if (token) {
      console.log('Token vàlid carregat al iniciar');
    }

    return {
      token,
      role: getRole(),
      name: getName(),
      isAuthenticated: !!token,
    };
  });

  // useEffect: S'executa una sola vegada al montar el component (al client)
  // Aquí es fa la lectura final i es configura el listener de sincronització
  useEffect(() => {
    // Definim la funció que ACTUALITZA l'estat d'autenticació
    // S'utilitza tant al montar com quan hi ha canvis en localStorage d'altres pestanyes
    const updateAuth = () => {
      // Pas 1: Llegir el token de localStorage
      const token = getToken();

      // Pas 2: Verificar si el token ha expirat
      if (token && isTokenExpired(token)) {
        // Token expirat → BORREM la sessió i guardem estat no autenticat
        clearToken();
        setAuth({
          token: null,
          role: null,
          name: null,
          isAuthenticated: false,
        });
        return;
      }

      // Pas 3: Si el token és vàlid, guardar l'estat complert d'autenticació
      setAuth({
        token,
        role: getRole(),
        name: getName(),
        isAuthenticated: !!token,
      });
    };

    // Executem updateAuth al montar el component
    // (En aquest moment el client ja ha hidratat, tenim accés a localStorage)
    updateAuth();

    // SINCRONITZACIÓ entre PESTANYES:
    // Registrem un listener per detectar canvis en localStorage d'altres pestanyes
    // Això permet sincronitzar logout si es fa "logout" en una altra finestra del navegador
    // Exemple: L'usuari fa logout en pestanya A → totes les altres pestanyes es sincronitzen
    window.addEventListener('storage', updateAuth);

    // Funció de NETEJA: S'executa quan el component es desmunta
    // Eliminem el listener per evitar fuites de memòria
    return () => {
      window.removeEventListener('storage', updateAuth);
    };
  }, []); // Array de dependències buit: s'executa UNA SOLA vegada

  // Retornem l'estat d'autenticació perquè els components ho puguin utilitzar
  return auth;
};
