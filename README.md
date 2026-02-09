# ReservesApp Frontend

![React](https://img.shields.io/badge/React-18.x-blue?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.x-purple?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-teal?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Descripción

Este repositorio contiene el **frontend** de **ReservesApp**, una aplicación para gestionar reservas de salas.  
Está desarrollado con **React**, usando **Vite** como bundler y **TailwindCSS** para estilos.

El frontend permite a los usuarios:

- Consultar disponibilidad de salas.
- Crear, editar y cancelar reservas.
- Visualizar horarios de manera clara y responsiva.
- Conectarse con el **backend REST** de Spring Boot.

---

## 🛠 Tecnologías

- **React 18** – Framework principal del frontend.
- **Vite 4** – Bundler y servidor de desarrollo.
- **JavaScript (ES6+)** – Lenguaje principal.
- **TailwindCSS 3** – Estilos rápidos y responsivos.
- **Axios / Fetch** – Comunicación con el backend.
- **Node.js & npm** – Entorno de desarrollo y gestión de dependencias.
- **GitHub** – Control de versiones.

---

## 📁 Estructura del proyecto

```text
reservesapp-frontend/
├─ public/               # Archivos estáticos (index.html, favicon, etc.)
├─ src/                  # Código fuente de React
│  ├─ components/        # Componentes reutilizables
│  ├─ pages/             # Páginas principales
│  ├─ services/          # Funciones para consumir API
│  ├─ App.jsx            # Componente principal
│  └─ main.jsx           # Entrada del proyecto
├─ node_modules/         # Dependencias del proyecto
├─ package.json           # Configuración del proyecto y scripts
├─ package-lock.json      # Lockfile de dependencias
├─ vite.config.js         # Configuración de Vite
└─ README.md             # Documentación del proyecto

