# ReservesApp Frontend

Frontend de **ReservesApp** construït amb **Next.js (App Router)**, **TypeScript** i **Tailwind CSS**. Inclou el login i panells (Admin/Employee) consumint una API REST.

## Stack

- **Framework:** Next.js 16
- **UI:** React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4 + PostCSS
- **Iconos:** lucide-react
- **Calidad:** ESLint (eslint-config-next)

## Requisits

- Node.js (recomanat: LTS)
- npm

## Configuració

1. Instal·lar dependències:

```bash
npm install
```

2. Variables d'entorn

Crea un fitxer `.env.local` a l'arrel del projecte:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> `NEXT_PUBLIC_*` s'exposa al navegador. No hi posis secrets.

3. Arrencar en desenvolupament:

```bash
npm run dev
```

Obrir: http://localhost:3000

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — servidor en modo producción
- `npm run lint` — lint del proyecto

## Integració amb l'API

Aquest frontend espera una API amb endpoints similars a:

- `POST /auth/login` → retorna un JSON tipus `{ token, role }`
- `GET /rooms` → retorna una llista de sales (array JSON)
- `POST /rooms` → crea una sala

La URL base es configura amb `NEXT_PUBLIC_API_URL`.

## Captura

<!-- Afegeix una captura a `public/screenshot.png` i actualitza el path si cal -->

![Captura del projecte](public/screenshot.png)

## Estructura del projecte

```text
.
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ login/
│  │  └─ page.tsx
│  ├─ dashboard/
│  │  ├─ admin/
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  └─ employee/
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  └─ services/
│     ├─ auth.ts
│     └─ rooms.ts
├─ components/
│  ├─ admin/
│  │  └─ AdminSidebar.tsx
│  ├─ employee/
│  │  └─ EmployeeSidebar.tsx
│  ├─ layout/
│  │  ├─ BurgerButton.tsx
│  │  └─ Header.tsx
│  └─ ui/
│     └─ Card.tsx
├─ public/
├─ eslint.config.mjs
├─ next.config.ts
├─ postcss.config.mjs
├─ tsconfig.json
└─ package.json
```

## Notes

- **App Router:** Les rutes viuen a `app/` (per exemple `app/login/page.tsx`).
- **Tailwind v4:** es carrega via `@import "tailwindcss";` a `app/globals.css`.
- Si canvies tipus/rutes, Next genera fitxers de validació dins de `.next/` automàticament (no editar-los a mà).
