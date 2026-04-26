/**
 * SERVEIS DE GESTIÓ DE TOKENS I AUTENTICACIÓ
 *
 * Fitxer: app/services/saveToken.ts
 *
 * RESPONSABILITATS:
 * - Emmagatzemar i recuperar tokens JWT del localStorage
 * - Gestionar les dades de sessió de l'usuari (token, rol, nom)
 * - Verificar l'expiració del token JWT
 * - Sincronitzar la sessió entre pestanyes del navegador
 *
 * FLUX DE SESSIÓ:
 * 1. Login → saveToken(token, role, name, rememberMe)
 * 2. App load → getToken(), getRole(), getName()
 * 3. Render → useAuth hook utilitza aquestes funcions
 * 4. Logout → clearToken()
 */

// Claus per emmagatzemar les dades al localStorage del navegador
// localStorage és un emmagatzematge persistent del navegador (fins logout)
const TOKEN_KEY = 'auth_token'; // Token JWT amb expiració (24h o 7 dies)
const ROLE_KEY = 'auth_role'; // Rol de l'usuari: 'ADMIN' o 'EMPLOYEE'
const NAME_KEY = 'auth_name'; // Nom de l'usuari per mostrar en interfície
const REMEMBER_ME_KEY = 'auth_remember_me'; // Flag: 'true' si sessió de 7 dies, 'false' si 24h

/**
 * Guarda les dades de la sessió al localStorage després del login
 *
 * @param token - Token JWT obtingut del backend (conté exp i altres dades)
 * @param role - Rol de l'usuari ('ADMIN' o 'EMPLOYEE')
 * @param name - Nom complet de l'usuari per mostrar
 * @param rememberMe - Si true, sessió de 7 dies; si false, 24 hores
 *
 * COMPORTAMENT:
 * - Les dades es guarden en localStorage (persistent)
 * - El token JWT conté la informació de expiració
 * - El backend valida el token a cada petició (portador del token en header)
 *
 * EXEMPLE D'ÚS:
 * const response = await login(email, password, rememberMe);
 * saveToken(response.token, response.role, response.name, rememberMe);
 */
export const saveToken = (
  token: string,
  role: string,
  name: string,
  rememberMe: boolean = false,
) => {
  // Pas 1: Guardar el token JWT
  // Aquest token s'utilitzarà en totes les peticions (header: Authorization: Bearer <token>)
  localStorage.setItem(TOKEN_KEY, token);

  // Pas 2: Guardar el rol de l'usuari
  // S'utilitza per determinar quin dashboard mostrar (admin vs employee)
  localStorage.setItem(ROLE_KEY, role);

  // Pas 3: Guardar el nom de l'usuari
  // S'utilitza per personalitzacions en la interfície (salutacions, etc)
  localStorage.setItem(NAME_KEY, name);

  // Pas 4: Guardar el flag de "Remember Me"
  // NO activarà automatment la sessió de 7 dies (això es controla a l'equip de backend)
  // Estem emmagatzemant aquest flag per a lògica futura
  localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
  console.log('Remember Me:', localStorage.getItem('auth_remember_me'));
};

/**
 * Recupera el token JWT del localStorage
 *
 * @returns El token JWT o null si no existeix
 *
 * IMPORTANT:
 * No verifica si el token ha expirat (veure isTokenExpired())
 * Es la responsabilitat del hook useAuth verificar expiració
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Recupera el rol de l'usuari del localStorage
 *
 * @returns 'ADMIN' | 'EMPLOYEE' | null
 *
 * S'utilitza per:
 * - Determinar quin dashboard mostrar
 * - Controlar accés a determinades funcions (via RoleGuard)
 * - Aplicar estils o funcionalitats específiques per rol
 */
export const getRole = (): string | null => {
  return localStorage.getItem(ROLE_KEY);
};

/**
 * Recupera el nom de l'usuari del localStorage
 *
 * @returns El nom complet de l'usuari o null
 *
 * S'utilitza per a:
 * - Mostrar salutacions personalitzades ("Bon dia, [Nom]")
 * - Mostrar en la barra d'encapçalament/sidebar
 * - Implementar lògica personalitzada per usuari
 */
export const getName = (): string | null => {
  return localStorage.getItem(NAME_KEY);
};

/**
 * Verifica si la sessió va ser iniciada amb "Remember Me"
 *
 * @returns true si la sessió és de 7 dies, false si és de 24h
 *
 * NOTA: Esta és informació visual
 * La verificació real d'expiració es fa per timestamp JWT (camp 'exp')
 */
export const isRememberMeSession = (): boolean => {
  return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
};

/**
 * Interfície per als claims del JWT
 */
interface JWTPayload {
  exp?: number;
  sub?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Funció privada: Decodifica un JWT sense validació criptogràfica
 *
 * ESTRUCTURA JWT: header.payload.signature
 *
 * Només decodifiquem el payload (la segona part) per accedir a:
 * - sub: Email de l'usuari
 * - role: Rol de l'usuari
 * - exp: Timestamp d'expiració (en segons)
 * - iat: Timestamp de creació
 *
 * IMPORTANT: NO verifica la signatura! Només per a expiració local
 * La validació real es fa al backend en cada petició
 *
 * @param token - Token JWT sencer
 * @returns Object amb els claims del token o null si inválid
 */
const decodeJWT = (token: string | null): JWTPayload | null => {
  if (!token) return null;
  try {
    // Dividir el JWT en 3 parts
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Obtenir el payload (la segona part)
    const payload = parts[1];

    // Afegir padding al base64 (alguns navegadors el necessiten)
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);

    // Decodificar de base64 a string
    const decoded = atob(padded);

    // Parsear el JSON per obtenir els claims
    return JSON.parse(decoded) as JWTPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Si hi ha error (token malformat), retornar null
    return null;
  }
};

/**
 * Verifica si el token JWT ha expirat comparant amb l'hora actual
 *
 * FUNCIONAMENT:
 * 1. Decodificar el JWT
 * 2. Obtenir el camp 'exp' (timestamp en SEGONS)
 * 3. Comparar amb l'hora actual (Date.now() / 1000 per convertir a segons)
 * 4. Si currentTime > exp → token expirat
 *
 * @param token - Token JWT a verificar
 * @returns true si ha expirat, false si és vàlid
 *
 * SEGURETAT:
 * - No s'utilitza per a validació de seguretat (és client-side)
 * - El backend SEMPRE valida l'expiració en cada petició
 * - Cette funció només es per a lògica UX (redirigir a login localment)
 *
 * EXEMPLE:
 * - Token amb exp: 1775927373
 * - Current time: 1775932000
 * - token ha expirat? YES (1775932000 > 1775927373)
 */
export const isTokenExpired = (token: string | null): boolean => {
  // Si no hi ha token, considerem que ha "expirat" (no és vàlid)
  if (!token) return true;

  // Decodificar el JWT
  const payload = decodeJWT(token);

  // Si el JWT no es pot decodificar o no té el camp 'exp', considerar expirat
  if (!payload || !payload.exp) {
    console.log('Token inválid o sense camp exp');
    return true;
  }

  // Obtenir l'hora actual en segons (JWT utilitza segons, no mil·lisegons)
  const currentTime = Math.floor(Date.now() / 1000);

  // Comparar: si currentTime > exp, el token ha expirat
  const isExpired = currentTime > payload.exp;

  // Logging per a debugging
  console.log('Token expiration check:');
  console.log(
    '   Current time:',
    new Date(currentTime * 1000).toLocaleString(),
  );
  console.log('   Exp time:', new Date(payload.exp * 1000).toLocaleString());
  console.log('   Is expired?:', isExpired);

  return isExpired;
};

export const getUserId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
};

/**
 * Esborra totes les dades de sessió del localStorage
 *
 * S'executa en:
 * - Click del botó "Logout"
 * - Token expirat (useAuth ho detecta)
 * - Logout en una altra pestanya (via storage events)
 *
 * COMPORTAMENT:
 * - Esborra token
 * - Esborra rol
 * - Esborra nom
 * - Esborra flag de Remember Me
 * - L'app es redirigeix a /login automàticament
 *
 * TRIGGERS DE STORAGE EVENTS:
 * Quan es crida clearToken() en una pestanya:
 * 1. localStorage es modifica
 * 2. Totes les altres pestanyes detecten l'event (storage event listener)
 * 3. useAuth actualitza el seu estat
 * 4. useAuth dispara redirecció a /login
 */
export const clearToken = () => {
  // Pas 1: Esborrar el token JWT
  localStorage.removeItem(TOKEN_KEY);

  // Pas 2: Esborrar el rol
  localStorage.removeItem(ROLE_KEY);

  // Pas 3: Esborrar el nom
  localStorage.removeItem(NAME_KEY);

  // Pas 4: Esborrar el flag de Remember Me
  localStorage.removeItem(REMEMBER_ME_KEY);
};
