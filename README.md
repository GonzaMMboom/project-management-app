# Sistema de Gestión de Proyectos y Tareas

Aplicación web fullstack para la gestión de proyectos y tareas, con autenticación de usuarios y control de acceso por roles.

El proyecto está desarrollado siguiendo buenas prácticas de la industria, con separación frontend / backend y arquitectura en capas.

---

## 🛠️ Stack Tecnológico

### Frontend
- **React** – Librería principal para la construcción de la interfaz
- **React Router** – Manejo de rutas y vistas protegidas
- **Context API** – Manejo de estado global (autenticación y usuario)
- **Fetch / Axios** – Comunicación con la API
- **Vite** (o Create React App) – Entorno de desarrollo

### Backend
- **Node.js** – Entorno de ejecución
- **Express.js** – Framework para la creación de la API REST
- **JWT (JSON Web Token)** – Autenticación y autorización
- **Arquitectura en capas** – Controllers, services, routes, middlewares

### Base de Datos
- **SQL** (MySQL / PostgreSQL)
- Relaciones entre tablas
- Manejo de claves foráneas

### Control de versiones
- **Git**
- **GitHub**
- Flujo de trabajo con ramas:
  - `main`
  - `develop`
  - `feature/*`

### Configuración y entorno
- Variables de entorno con `.env`
- Archivos `.env.example` versionados
- Separación de entornos (desarrollo / producción)

---

## 📁 Estructura del Proyecto

```text
project-management-app/
├── backend/
├── frontend/
└── README.md
