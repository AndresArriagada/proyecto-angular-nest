# Proyecto Angular 11 + NestJS - Gestión de Usuarios

Este proyecto es una aplicación completa de gestión de usuarios con Angular 11 en el frontend y NestJS en el backend.

## Estructura del Proyecto

```
proyecto-angular-nest/
├── backend/          # API REST con NestJS
└── frontend/app/     # Aplicación Angular 11
```

## Requisitos

- Node.js v22.14.0 (o compatible)
- npm 10.9.2 (o compatible)

## Instalación

Las dependencias ya están instaladas. Si necesitas reinstalar:

### Backend (NestJS)
```bash
cd backend
npm install
```

### Frontend (Angular 11)
```bash
cd frontend/app
npm install --legacy-peer-deps
```

## Ejecución

### 1. Iniciar el Backend

Abre una terminal y ejecuta:

```bash
cd backend
npm run start
```

El servidor estará disponible en: `http://localhost:3000`

### 2. Iniciar el Frontend

Abre otra terminal y ejecuta:

```bash
cd frontend/app
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

Abre tu navegador en `http://localhost:4200` para ver la aplicación.

## Funcionalidades

La aplicación permite:

- ✅ **Crear usuarios**: Formulario para agregar nuevos usuarios con nombre, email y edad (opcional)
- ✅ **Listar usuarios**: Ver todos los usuarios registrados en una tabla
- ✅ **Editar usuarios**: Modificar la información de usuarios existentes
- ✅ **Eliminar usuarios**: Eliminar usuarios con confirmación

## API Endpoints (Backend)

- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener un usuario por ID
- `POST /users` - Crear un nuevo usuario
- `PUT /users/:id` - Actualizar un usuario
- `DELETE /users/:id` - Eliminar un usuario

### Ejemplo de Payload para Crear Usuario

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "edad": 25
}
```

## Tecnologías Utilizadas

### Backend
- NestJS (Framework)
- TypeScript
- CORS habilitado para comunicación con Angular

### Frontend
- Angular 11
- TypeScript
- HttpClient para peticiones HTTP
- FormsModule para formularios
- CSS para estilos

## Arquitectura

### Backend
- **Controllers**: Manejan las rutas HTTP
- **Services**: Contienen la lógica de negocio
- **DTOs**: Definen la estructura de datos
- **Entities**: Modelos de datos (en memoria)

### Frontend
- **Components**: UserFormComponent para el CRUD de usuarios
- **Services**: UsersService para comunicación con la API
- **Models**: Interfaces TypeScript para los tipos de datos

## Notas

- Los datos se almacenan en memoria en el backend (se pierden al reiniciar el servidor)
- El backend incluye validaciones básicas
- El frontend incluye manejo de errores y mensajes de feedback
- CORS está configurado para permitir peticiones desde `http://localhost:4200`

## Desarrollo Futuro

Posibles mejoras:
- Integrar base de datos (PostgreSQL, MongoDB, etc.)
- Agregar validaciones con class-validator
- Implementar autenticación y autorización
- Agregar paginación en la lista de usuarios
- Mejorar el diseño con un framework CSS (Bootstrap, Material, etc.)
