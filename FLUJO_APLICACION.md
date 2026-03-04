# 🔄 Flujo Completo de la Aplicación - Backend y Frontend

## 📖 Índice
1. [Vista General](#vista-general)
2. [Inicio de la Aplicación](#inicio-de-la-aplicación)
3. [Flujo: Listar Usuarios (GET)](#flujo-listar-usuarios-get)
4. [Flujo: Crear Usuario (POST)](#flujo-crear-usuario-post)
5. [Resumen de Archivos](#resumen-de-archivos)

---

## 🎯 Vista General

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO                                │
└─────────────────────────────────────────────────────────────────┘

[Usuario en Navegador]
        │
        │ 1. Abre http://localhost:4200
        ▼
┌────────────────────┐
│   ANGULAR (SPA)    │
│  Puerto 4200       │
│                    │
│  ┌──────────────┐  │
│  │ Component    │  │ ◄── Muestra la interfaz
│  │ (TypeScript) │  │     Maneja interacciones del usuario
│  └──────┬───────┘  │
│         │          │
│  ┌──────▼───────┐  │
│  │   Service    │  │ ◄── Hace peticiones HTTP
│  │ (HTTP Client)│  │     Comunica con el backend
│  └──────┬───────┘  │
└─────────┼──────────┘
          │
          │ 2. HTTP Request (JSON)
          │    GET /users
          │    POST /users
          ▼
┌────────────────────┐
│   NESTJS (API)     │
│  Puerto 3000       │
│                    │
│  ┌──────────────┐  │
│  │ Controller   │  │ ◄── Recibe peticiones HTTP
│  │ (@Get, @Post)│  │     Define rutas/endpoints
│  └──────┬───────┘  │
│         │          │
│  ┌──────▼───────┐  │
│  │   Service    │  │ ◄── Lógica de negocio
│  │              │  │     Manipula datos
│  └──────┬───────┘  │
│         │          │
│  ┌──────▼───────┐  │
│  │   Entity     │  │ ◄── Estructura de datos
│  │   (Model)    │  │     Define qué es un User
│  └──────────────┘  │
└────────────────────┘
          │
          │ 3. HTTP Response (JSON)
          │    { "id": 1, "nombre": "Juan" }
          ▼
[Usuario ve los datos en pantalla]
```

---

## 🚀 Inicio de la Aplicación

### PASO 1: Usuario abre http://localhost:4200

#### 1.1 Angular carga `index.html`
**Archivo:** `frontend/app/src/index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <title>App</title>
</head>
<body>
  <app-root></app-root>  ← Angular se monta aquí
</body>
</html>
```

**¿Qué hace?**
- Es el único archivo HTML real
- Define dónde se va a montar la aplicación Angular (`<app-root>`)
- Angular reemplaza `<app-root>` con tu aplicación completa

---

#### 1.2 Angular ejecuta `main.ts`
**Archivo:** `frontend/app/src/main.ts`

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

**¿Qué hace?**
- ✅ Es el punto de entrada de Angular
- ✅ Carga el módulo principal (`AppModule`)
- ✅ Inicia toda la aplicación

---

#### 1.3 Angular carga `AppModule`
**Archivo:** `frontend/app/src/app/app.module.ts`

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UsersService } from './users/users.service';

@NgModule({
  declarations: [
    AppComponent,        // ← Componente raíz
    UserFormComponent    // ← Componente de formulario
  ],
  imports: [
    BrowserModule,       // ← Para que funcione en el navegador
    HttpClientModule,    // ← Para hacer peticiones HTTP
    FormsModule          // ← Para formularios (ngModel)
  ],
  providers: [
    UsersService         // ← Servicio disponible en toda la app
  ],
  bootstrap: [AppComponent]  // ← Componente inicial
})
export class AppModule { }
```

**¿Qué hace?**
- ✅ **declarations**: Declara qué componentes existen
- ✅ **imports**: Importa módulos necesarios (HTTP, Formularios)
- ✅ **providers**: Registra servicios (UsersService)
- ✅ **bootstrap**: Define el componente inicial (AppComponent)

---

#### 1.4 Angular renderiza `AppComponent`
**Archivo:** `frontend/app/src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',           // ← Se monta en <app-root>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
```

**Archivo:** `frontend/app/src/app/app.component.html`

```html
<div style="text-align:center">
  <h1>Gestión de Usuarios</h1>
</div>

<!-- Aquí se carga el componente hijo -->
<app-user-form></app-user-form>
```

**¿Qué hace?**
- ✅ Es el componente principal (root)
- ✅ Muestra el título
- ✅ Carga el componente `UserFormComponent` con `<app-user-form>`

---

#### 1.5 Angular renderiza `UserFormComponent`
**Archivo:** `frontend/app/src/app/users/user-form/user-form.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  
  user: User = { nombre: '', email: '' };  // Usuario temporal para el form
  users: User[] = [];                      // Lista de usuarios

  constructor(private usersService: UsersService) { }  // ← Inyecta el servicio

  ngOnInit() {
    this.getUsers();  // ← Se ejecuta al iniciar el componente
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;  // ← Guarda los usuarios en la variable
      }
    );
  }

  onSubmit() {
    this.usersService.createUser(this.user).subscribe(
      (response: User) => {
        this.users.push(response);  // ← Agrega el nuevo usuario
        this.user = { nombre: '', email: '' };  // ← Limpia el form
      }
    );
  }

  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe(
      () => {
        this.users = this.users.filter(u => u.id !== id);  // ← Elimina de la lista
      }
    );
  }
}
```

**¿Qué hace cada método?**

| Método | Cuándo se ejecuta | Qué hace |
|--------|-------------------|----------|
| `constructor()` | Al crear el componente | Inyecta el UsersService |
| `ngOnInit()` | Al iniciar el componente | Llama a `getUsers()` para cargar datos |
| `getUsers()` | Al iniciar y después de crear | Pide usuarios al backend |
| `onSubmit()` | Al enviar el formulario | Crea un nuevo usuario |
| `deleteUser()` | Al hacer clic en eliminar | Elimina un usuario |

---

## 📝 Flujo: Listar Usuarios (GET)

### FRONTEND → BACKEND → FRONTEND

```
┌─────────────────────────────────────────────────────────────────┐
│ PASO A PASO: Cargar lista de usuarios                           │
└─────────────────────────────────────────────────────────────────┘

PASO 1: Componente llama al servicio
├─ Archivo: user-form.component.ts
├─ Método: ngOnInit() → getUsers()
└─ Código:
   
   ngOnInit() {
     this.getUsers();  // ← Inicia el flujo
   }

   getUsers() {
     this.usersService.getUsers().subscribe(...)  // ← Llama al servicio
   }

           ↓

PASO 2: Servicio hace petición HTTP
├─ Archivo: users.service.ts
├─ Método: getUsers()
└─ Código:

   getUsers(): Observable<User[]> {
     return this.http.get<User[]>('http://localhost:3000/users');
     //              ↑
     //              Petición HTTP GET al backend
   }

           ↓
           
   🌐 HTTP Request: GET http://localhost:3000/users

           ↓

PASO 3: Backend recibe la petición
├─ Archivo: users.controller.ts
├─ Decorador: @Get()
└─ Código:

   @Get()  // ← Responde a GET /users
   findAll() {
     return this.usersService.findAll();  // ← Llama al servicio
   }

           ↓

PASO 4: Service del backend procesa
├─ Archivo: users.service.ts (backend)
├─ Método: findAll()
└─ Código:

   findAll(): User[] {
     return this.users;  // ← Retorna el array de usuarios
   }
   
   // users = [
   //   { id: 1, nombre: 'Juan', email: 'juan@example.com', edad: 25 }
   // ]

           ↓

PASO 5: Backend envía respuesta
└─ HTTP Response:
   
   Status: 200 OK
   Body: [
     { "id": 1, "nombre": "Juan", "email": "juan@example.com", "edad": 25 }
   ]

           ↓

PASO 6: Frontend recibe la respuesta
├─ Archivo: user-form.component.ts
├─ Método: getUsers()
└─ Código:

   this.usersService.getUsers().subscribe(
     (data: User[]) => {
       this.users = data;  // ← Guarda en la variable del componente
       //                      Esto actualiza automáticamente la vista
     }
   );

           ↓

PASO 7: Angular actualiza la vista
├─ Archivo: user-form.component.html
└─ Código:

   <table>
     <tr *ngFor="let user of users">  ← Itera sobre this.users
       <td>{{ user.nombre }}</td>     ← Muestra cada usuario
       <td>{{ user.email }}</td>
       <td>{{ user.edad }}</td>
     </tr>
   </table>

           ↓

🎉 Usuario ve la tabla con datos en pantalla
```

---

## ✍️ Flujo: Crear Usuario (POST)

### Usuario llena formulario → Frontend → Backend → Frontend actualiza tabla

```
┌─────────────────────────────────────────────────────────────────┐
│ PASO A PASO: Crear nuevo usuario                                │
└─────────────────────────────────────────────────────────────────┘

PASO 1: Usuario llena el formulario
├─ Archivo: user-form.component.html
└─ Código:

   <form (ngSubmit)="onSubmit()">
     <input [(ngModel)]="user.nombre" name="nombre">
     <!--      ↑                              -->
     <!-- Two-way binding: lo que escribes se guarda en user.nombre -->
     
     <input [(ngModel)]="user.email" name="email">
     <button type="submit">Crear Usuario</button>
   </form>

   Usuario escribe:
   - Nombre: "María"
   - Email: "maria@example.com"
   
   Esto actualiza automáticamente:
   user = { nombre: 'María', email: 'maria@example.com' }

           ↓

PASO 2: Usuario hace clic en "Crear Usuario"
├─ Evento: (ngSubmit)="onSubmit()"
├─ Archivo: user-form.component.ts
└─ Método: onSubmit()

   onSubmit() {
     // En este punto:
     // this.user = { nombre: 'María', email: 'maria@example.com' }
     
     this.usersService.createUser(this.user).subscribe(...)
   }

           ↓

PASO 3: Servicio hace petición HTTP POST
├─ Archivo: users.service.ts
├─ Método: createUser(user)
└─ Código:

   createUser(user: User): Observable<User> {
     return this.http.post<User>('http://localhost:3000/users', user);
     //               ↑                                          ↑
     //              POST                                     Body (datos)
   }

           ↓

   🌐 HTTP Request: POST http://localhost:3000/users
   Headers: Content-Type: application/json
   Body: {
     "nombre": "María",
     "email": "maria@example.com"
   }

           ↓

PASO 4: Backend recibe la petición
├─ Archivo: users.controller.ts
├─ Decorador: @Post()
└─ Código:

   @Post()  // ← Responde a POST /users
   create(@Body() createUserDto: CreateUserDto) {
     //      ↑
     //     Extrae el body del request
     //     createUserDto = { nombre: 'María', email: 'maria@example.com' }
     
     return this.usersService.create(createUserDto);
   }

           ↓

PASO 5: Service del backend crea el usuario
├─ Archivo: users.service.ts (backend)
├─ Método: create(createUserDto)
└─ Código:

   create(createUserDto: CreateUserDto): User {
     const newUser = {
       id: this.users.length + 1,  // ← Genera ID
       ...createUserDto             // ← Copia nombre, email, edad
     };
     
     // newUser = { id: 2, nombre: 'María', email: 'maria@example.com' }
     
     this.users.push(newUser);  // ← Lo agrega al array
     return newUser;            // ← Lo devuelve
   }

           ↓

PASO 6: Backend envía respuesta
└─ HTTP Response:
   
   Status: 201 Created
   Body: {
     "id": 2,
     "nombre": "María",
     "email": "maria@example.com"
   }

           ↓

PASO 7: Frontend recibe la respuesta
├─ Archivo: user-form.component.ts
├─ Método: onSubmit()
└─ Código:

   this.usersService.createUser(this.user).subscribe(
     (response: User) => {
       // response = { id: 2, nombre: 'María', email: 'maria@example.com' }
       
       this.users.push(response);  // ← Agrega a la lista
       this.user = { nombre: '', email: '' };  // ← Limpia el formulario
     }
   );

           ↓

PASO 8: Angular actualiza la vista automáticamente
└─ Como this.users cambió, Angular re-renderiza:

   <tr *ngFor="let user of users">
     <!-- Ahora muestra el nuevo usuario en la tabla -->
   </tr>

           ↓

🎉 Usuario ve el nuevo usuario en la tabla SIN recargar la página
```

---

## 📂 Resumen de Archivos y sus Funciones

### BACKEND (NestJS) - Puerto 3000

```
backend/src/
│
├── main.ts
│   └── ⚙️ Inicia el servidor NestJS en puerto 3000
│       └── Habilita CORS para permitir peticiones desde Angular
│
├── app.module.ts
│   └── 📦 Módulo raíz que importa UsersModule
│
└── users/
    │
    ├── users.module.ts
    │   └── 📦 Declara Controllers, Services y Providers del módulo
    │
    ├── users.controller.ts
    │   └── 🎯 Define los endpoints HTTP (rutas)
    │       ├── @Get()     → GET /users       → findAll()
    │       ├── @Get(':id') → GET /users/1    → findOne(1)
    │       ├── @Post()    → POST /users      → create(data)
    │       ├── @Put(':id') → PUT /users/1    → update(1, data)
    │       └── @Delete(':id') → DELETE /users/1 → remove(1)
    │
    ├── users.service.ts
    │   └── 💼 Lógica de negocio
    │       ├── Almacena usuarios en memoria (array)
    │       ├── findAll() → Retorna todos los usuarios
    │       ├── findOne() → Busca un usuario por ID
    │       ├── create()  → Crea un nuevo usuario
    │       ├── update()  → Actualiza un usuario
    │       └── remove()  → Elimina un usuario
    │
    ├── entities/
    │   └── user.entity.ts
    │       └── 📋 Define la estructura de un User
    │           interface User {
    │             id: number;
    │             nombre: string;
    │             email: string;
    │             edad?: number;
    │           }
    │
    └── dto/
        └── create-user.dto.ts
            └── 📝 Define qué datos se necesitan para crear un User
                class CreateUserDto {
                  nombre: string;
                  email: string;
                  edad?: number;
                }
```

### FRONTEND (Angular) - Puerto 4200

```
frontend/app/src/
│
├── main.ts
│   └── ⚙️ Punto de entrada, carga AppModule
│
├── index.html
│   └── 📄 HTML base con <app-root></app-root>
│
└── app/
    │
    ├── app.module.ts
    │   └── 📦 Módulo raíz
    │       ├── Declara: AppComponent, UserFormComponent
    │       ├── Importa: HttpClientModule, FormsModule
    │       └── Provee: UsersService
    │
    ├── app.component.ts + .html + .css
    │   └── 🏠 Componente raíz
    │       └── Muestra título y carga <app-user-form>
    │
    └── users/
        │
        ├── user.model.ts
        │   └── 📋 Interface TypeScript (igual que entity del backend)
        │       interface User {
        │         id?: number;
        │         nombre: string;
        │         email: string;
        │         edad?: number;
        │       }
        │
        ├── users.service.ts
        │   └── 🌐 HTTP Client - Comunica con el backend
        │       ├── getUsers()      → GET /users
        │       ├── getUser(id)     → GET /users/:id
        │       ├── createUser()    → POST /users
        │       ├── updateUser()    → PUT /users/:id
        │       └── deleteUser(id)  → DELETE /users/:id
        │
        └── user-form/
            │
            ├── user-form.component.ts
            │   └── 🎯 Lógica del componente
            │       ├── Variables:
            │       │   ├── user: User     → Usuario temporal del form
            │       │   └── users: User[]  → Lista de usuarios
            │       │
            │       └── Métodos:
            │           ├── ngOnInit()   → Se ejecuta al iniciar
            │           ├── getUsers()   → Obtiene lista del backend
            │           ├── onSubmit()   → Crea nuevo usuario
            │           ├── editUser()   → Carga usuario para editar
            │           └── deleteUser() → Elimina usuario
            │
            ├── user-form.component.html
            │   └── 📄 Template HTML
            │       ├── Formulario con [(ngModel)]
            │       ├── Tabla con *ngFor
            │       └── Botones con (click)
            │
            └── user-form.component.css
                └── 🎨 Estilos del componente
```

---

## 🔑 Conceptos Clave

### 1. **Inyección de Dependencias**

**En el frontend:**
```typescript
export class UserFormComponent {
  constructor(private usersService: UsersService) { }
  //          ↑
  //          Angular automáticamente crea una instancia de UsersService
  //          y la inyecta aquí
}
```

**En el backend:**
```typescript
export class UsersController {
  constructor(private usersService: UsersService) {}
  //          ↑
  //          NestJS automáticamente inyecta el servicio
}
```

### 2. **Decoradores**

Los decoradores son anotaciones que añaden metadatos:

```typescript
@Component({...})       // Define un componente de Angular
@Injectable()           // Permite que sea inyectable
@Controller('users')    // Define un controlador para ruta /users
@Get()                  // Endpoint GET
@Post()                 // Endpoint POST
```

### 3. **Observables (RxJS)**

Angular usa Observables para operaciones asincrónicas:

```typescript
this.usersService.getUsers().subscribe(
  (data) => {
    // Este código se ejecuta cuando llega la respuesta
    this.users = data;
  }
);
```

**¿Por qué `.subscribe()`?**
- Los Observables son "lazy" (no se ejecutan hasta que te suscribes)
- Permiten cancelar peticiones
- Permiten operadores (map, filter, etc.)

### 4. **Two-way Binding**

```html
<input [(ngModel)]="user.nombre">
```

**Significa:**
- **Vista → Modelo**: Lo que escribes actualiza `user.nombre`
- **Modelo → Vista**: Si cambias `user.nombre` en código, el input se actualiza

---

## 🎓 Resumen Ejecutivo

### Cuando la app arranca:
1. ✅ Angular carga `main.ts` → `AppModule` → `AppComponent`
2. ✅ `AppComponent` carga `UserFormComponent`
3. ✅ `UserFormComponent.ngOnInit()` llama a `getUsers()`
4. ✅ Se hace request al backend y se muestran los datos

### Cuando el usuario crea un usuario:
1. ✅ Usuario llena el form (two-way binding actualiza `user`)
2. ✅ Usuario hace submit → `onSubmit()`
3. ✅ `UsersService.createUser()` hace POST al backend
4. ✅ Backend procesa y devuelve el nuevo usuario con ID
5. ✅ Frontend agrega el usuario a la lista
6. ✅ Angular re-renderiza la tabla automáticamente

### Flujo de datos:
```
Usuario → Component → Service → HTTP → Backend Controller → 
Backend Service → Backend Entity → Backend Service → 
Backend Controller → HTTP Response → Frontend Service → 
Component → Template → Usuario ve resultados
```

---