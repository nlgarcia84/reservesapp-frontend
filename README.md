# RoomyApp Frontend

Frontend per a **RoomyApp** - Aplicació de **gestió de reserves de sales**. Desenvolupat amb **Next.js 16**, **TypeScript** i **Tailwind CSS v4**. Inclou autenticació JWT, panells d'administrador i empleat, amb consumició d'API REST.

## 📚 Stack Tecnològic

- **Framework:** Next.js 16.2.1 (Turbopack)
- **Llenguatge:** TypeScript
- **UI/Componentes:** React 19
- **Estilos:** Tailwind CSS v4 + PostCSS
- **Iconos:** lucide-react
- **Testing:** Jest + React Testing Library
- **Qualitat:** ESLint + TypeScript strict mode
- **Autenticació:** JWT (JSON Web Tokens)

## 📋 Requisits Previs

- **Node.js** versió 18+ (recomanat LTS)
- **npm** o **yarn**
- Accés a l'API del backend en `http://localhost:8080` (desenvolupament)

## 🚀 Guia de Desenvolupament

### 1️⃣ Instal·lació de Dependències

```bash
cd reservesapp-frontend
npm install
```

### 2️⃣ Configuració de Variables d'Entorn

Crea un fitxer `.env.local` a l'arrel del projecte:

```bash
# .env.local (desenvolupament)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Nota important:**

- Les variables amb prefixe `NEXT_PUBLIC_*` es publiquen al navegador
- No hi posis secrets o tokens permanents
- Per producció, usa `.env.production`

### 3️⃣ Arrencar el Servidor de Desenvolupament

```bash
npm run dev
```

La aplicació estarà disponible a **http://localhost:3000**

### 4️⃣ Autenticació de Prova

Utilitza les següents credencials de prova:

**Admin:**

- Email: `admin@roomyapp.cat`
- Contrasenya: `admin123`

**Empleat:**

- Email: `employe@roomyapp.cat`
- Contrasenya: `employe123`

## 📦 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desenvolupament (port 3000)
npm run build    # Crea la build de producció (optimitzada)
npm run start    # Executa el servidor en mode producció
npm run lint     # Verifica la qualitat del codi (ESLint)
npm run test     # Executa els tests (Jest)
```

## 🏗️ Estructura del Projecte

```
reservesapp-frontend/
├── app/
│   ├── (auth)/                           # Rutes d'autenticació
│   │   ├── login/page.tsx               # Pàgina de login
│   │   ├── signup/page.tsx              # Pàgina de registre
│   │   └── layout.tsx
│   ├── (landing)/                        # Landing page pública
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── admin/                        # Panell d'administrador
│   │   │   ├── page.tsx                 # Dashboard admin
│   │   │   ├── gestio-sales/            # Gestió de sales
│   │   │   ├── gestio-usuaris/          # Gestió d'usuaris
│   │   │   └── gestio-reserves/         # Gestió de reserves
│   │   └── employee/                     # Panell d'empleat
│   │       ├── page.tsx                 # Dashboard empleat
│   │       └── layout.tsx
│   ├── hooks/                            # Custom React hooks
│   │   ├── useAuth.ts                   # Hook d'autenticació
│   │   ├── useLoadingState.ts           # Hook de loading
│   │   └── useTimeGreeting.ts           # Hook de salutació per hora
│   ├── services/                         # Serveis d'API
│   │   ├── auth.ts                      # Autenticació (login/signup)
│   │   ├── rooms.ts                     # Gestió de sales
│   │   ├── users.ts                     # Gestió d'usuaris
│   │   ├── registration.ts              # Registre d'usuaris
│   │   └── saveToken.ts                 # Manteniment de JWT
│   ├── utils/                            # Utilitats
│   │   └── avatar.ts                    # Generació d'avatars
│   ├── globals.css                       # Estilos globals
│   └── layout.tsx                        # Layout arrel
├── components/
│   ├── admin/                            # Componentes admin
│   │   ├── AddRoomForm.tsx
│   │   ├── DeleteRoomForm.tsx
│   │   ├── AddUserForm.tsx
│   │   ├── DeleteUserForm.tsx
│   │   └── AdminSidebar.tsx
│   ├── employee/                         # Componentes empleat
│   │   └── EmployeeSidebar.tsx
│   ├── layout/                           # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── SidebarLayout.tsx
│   │   ├── Interruptor.tsx              # Toggle dark mode
│   │   └── BurgerButton.tsx
│   └── ui/                               # Componentes reutilitzables
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── InputForm.tsx
│       ├── BackButton.tsx
│       └── DeleteButton.tsx
├── public/                               # Fitxers públics
│   └── images/                           # Imatges
│       ├── screen1.png
│       └── screen2.png
├── lib/                                  # Utilitats compartides
├── .env.local                            # Variables locals (NO commitar)
├── .env.example                          # Plantilla de variables
├── .env.production                       # Variables de producció
├── eslint.config.mjs                     # Configuració ESLint
├── jest.config.mjs                       # Configuració Jest
├── jest.setup.ts                         # Setup de tests
├── next.config.ts                        # Configuració Next.js
├── postcss.config.mjs                    # Configuració PostCSS
├── tsconfig.json                         # Configuració TypeScript
└── package.json
```

## 🔌 Integració amb l'API

La aplicació està connectada a un backend Spring Boot que ha de tenir els seguents endpoints:

### Autenticació

- `POST /auth/login` → Login d'usuari, retorna `{ token, role, name }`

### Sales (Rooms)

- `GET /rooms` → Llista de sales disponibles
- `POST /rooms` → Crea nova sala (admin)
- `DELETE /rooms/{id}` → Elimina sala (admin)

### Usuaris

- `GET /users` → Llista d'usuaris (admin)
- `POST /users` → Crea nou usuari (admin)
- `DELETE /users/{id}` → Elimina usuari (admin)

### Reserves

- `GET /reserves` → Llista de reserves
- `POST /reserves` → Crea nova reserva
- `DELETE /reserves/{id}` → Cancella reserva

**URL Base:** Es configura amb la variable `NEXT_PUBLIC_API_URL`

## 📸 Captures de Pantalla

### Panell d'Administrador

![Panell Admin](./public/screen1.png)

### Panell d'Empleat

![Panell Empleat](./public/screen2.png)

## 🔐 Autenticació i Autorització

- **JWT Tokens:** L'aplicació usa JWT per a l'autenticació
- **Roles:** Admin i Empleat amb permisos diferenciats
- **Protected Routes:** Només usuaris autenticats accedeixen al dashboard
- **Token Storage:** Es guarda en localStorage amb opció "Recorda'm la sessió"

## 🛠️ Desenvolupament

### Afegir una Pàgina Nova

```bash
# Crear carpeta i fitxer
mkdir -p app/[nova-secció]
touch app/[nova-secció]/page.tsx
```

### Afegir un Component

```bash
# Crear component reutilitzable
touch components/[categoria]/NovelComponent.tsx
```

### Afegir Tests

```bash
# Crear test per a un component
touch components/[categoria]/NoveComponent.test.tsx
```

## 📝 Guia per a Professors

Per executar el projecte correctament en mode desenvolupament:

1. **Clonar el repositori:**

   ```bash
   git clone https://github.com/nlgarcia84/reservesapp-frontend.git
   cd reservesapp-frontend
   ```

2. **Instal·lar dependències:**

   ```bash
   npm install
   ```

3. **Configurar variables d'entorn:**

   ```bash
   cp .env.example .env.local
   # Editar .env.local amb la URL del backend (localhost:8080)
   ```

4. **Assegurir-se que el backend corre:**
   - El backend ha de estar disponible a `http://localhost:8080`
   - La base de dades PostgreSQL ha de estar connectada
   - Els endpoints d'API han d'estar funcionals

5. **Arrencar el frontend:**

   ```bash
   npm run dev
   ```

6. **Accedir a l'aplicació:**
   - Obrir navegador: http://localhost:3000
   - Testejar amb les credencials de prova (veure secció 4️⃣ dalt)

## 🚀 Deployment a Producció (Vercel)

1. Configurar variables d'entorn a Vercel Dashboard
2. Fer push a `main` branch
3. Vercel deployarà automàticament

## 📞 Suport i Preguntes

Per a dubtes sobre el codi o configuració, contactar amb l'equip de desenvolupament.
├─ tsconfig.json
└─ package.json

```

## Notes

- **App Router:** Les rutes viuen a `app/` (per exemple `app/login/page.tsx`).
- **Tailwind v4:** es carrega via `@import "tailwindcss";` a `app/globals.css`.
- Si canvies tipus/rutes, Next genera fitxers de validació dins de `.next/` automàticament (no editar-los a mà).
```
