# TPI – Sistema de Gestión de Turnos Médicos

## Desarrollo de Software 2026 – Frontend

**Universidad Tecnológica Nacional – Facultad Regional Tucumán**

### Integrantes

| Integrante | Legajo |
|---|---|
| Baena, Paula Melina | 60596 |
| Chirino, Carlos Iván | 60388 |
| Robles, Sisa Verónica | 60535 |
| Vicente, Juana | 60599 |

## 1. Descripción del proyecto

Este repositorio contiene el frontend del Trabajo Práctico Integrador de Desarrollo de Software 2026.

Se desarrolló una aplicación web para la gestión de turnos médicos, que permite a pacientes consultar disponibilidades y reservar turnos, mientras que los administradores gestionan médicos, especialidades, disponibilidades y consultas de citas.

El frontend consume una API REST desarrollada con ASP.NET Core y utiliza autenticación mediante JWT.

## 2. Tecnologías utilizadas

- React 19
- JavaScript y JSX
- Vite 7
- React Router DOM
- Axios
- Tailwind CSS 4
- React Hook Form
- HTML5 y CSS3

## 3. Funcionalidades principales

### Módulo de pacientes

- Inicio de sesión mediante correo electrónico y DNI.
- Registro automático del paciente en su primer acceso, según la lógica del backend.
- Consulta de médicos y especialidades.
- Visualización de disponibilidades y horarios.
- Reserva de turnos.
- Consulta y cancelación de turnos propios.
- Calendario semanal con visualización de lunes a domingo, sin fechas anteriores a la actual.

### Módulo de administración

- Inicio de sesión de administradores.
- Panel de administración.
- Gestión de médicos.
- Gestión de especialidades.
- Gestión de disponibilidades.
- Búsqueda y filtrado de citas por DNI, médico, especialidad y fecha.
- Paginación de resultados.

## 4. Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm compatibles con Vite 7.
- Git.
- Visual Studio Code u otro editor.
- Backend del TPI configurado y en ejecución.

Se recomienda utilizar una versión LTS de Node.js compatible con las dependencias del proyecto.

## 5. Instalación

Clonar el repositorio del frontend y acceder a su carpeta.

```bash
git clone https://github.com/juanavicente/unidad5-boilerplate
cd unidad5-boilerplate
```

Para trabajar con la versión integrada del equipo:

```bash
git checkout development
```

Instalar las dependencias:

```bash
npm install
```

## 6. Configuración de variables de entorno

La aplicación utiliza la variable `VITE_BACKEND_URL` para establecer la dirección de la API.

En la raíz del proyecto existe un archivo `.env.example` con la configuración de referencia:

```env
VITE_BACKEND_URL=http://localhost:5278/
```

Crear un archivo `.env.development` con esa configuración, ajustando el puerto si el backend utiliza otro.

La variable es utilizada por Axios para configurar la URL base de las solicitudes HTTP.

**Importante:** las variables de Vite que comienzan con `VITE_` quedan expuestas al navegador. No deben utilizarse para almacenar contraseñas, tokens privados ni otras credenciales.

## 7. Ejecución del proyecto

Primero, iniciar el backend ASP.NET Core.

Después, desde la carpeta del frontend, ejecutar:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local de acceso, normalmente:

```text
http://localhost:5173/
```

Abrir esa dirección en el navegador.

### Otros comandos

| Comando | Descripción |
|---|---|
| `npm install` | Instala las dependencias |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la compilación de producción |
| `npm run preview` | Permite previsualizar la compilación |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Aplica el formato de Prettier |
| `npm run format:check` | Comprueba el formato del código |

## 8. Rutas principales del frontend

### Pacientes

| Ruta | Funcionalidad |
|---|---|
| `/login` | Inicio de sesión del paciente |
| `/` | Inicio y búsqueda de disponibilidades |
| `/appointments` | Consulta de turnos del paciente |

### Administración

| Ruta | Funcionalidad |
|---|---|
| `/admin/login` | Inicio de sesión del administrador |
| `/admin/home` | Panel de administración |
| `/admin/doctors` | Gestión de médicos |
| `/admin/specialties` | Gestión de especialidades |
| `/admin/availabilities` | Gestión de disponibilidades |
| `/admin/patients` | Búsqueda y filtrado de citas |

Las rutas protegidas requieren autenticación y el rol correspondiente.

## 9. Endpoints principales consumidos

Todas las rutas se resuelven respecto de `VITE_BACKEND_URL`.

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/patient/login` | Inicio de sesión del paciente |
| POST | `/api/auth/admin/login` | Inicio de sesión del administrador |

### Médicos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/doctors` | Listar y buscar médicos |
| GET | `/api/doctors/{id}` | Consultar médico |
| POST | `/api/doctors` | Registrar médico |
| PUT | `/api/doctors/{id}` | Actualizar médico |
| DELETE | `/api/doctors/{id}` | Dar de baja médico |

### Especialidades

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/specialties` | Listar especialidades |
| GET | `/api/specialties/{id}` | Consultar especialidad |
| POST | `/api/specialties` | Registrar especialidad |
| PUT | `/api/specialties/{id}` | Actualizar especialidad |
| DELETE | `/api/specialties/{id}` | Dar de baja especialidad |

### Disponibilidades

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/doctors/{id}/availabilities` | Consultar disponibilidades del médico |
| GET | `/api/availabilities/{id}/slots` | Consultar horarios disponibles |
| POST | `/api/availabilities` | Registrar disponibilidad |
| PUT | `/api/availabilities` | Actualizar disponibilidad |

### Citas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/appointments/patient` | Consultar citas del paciente autenticado |
| POST | `/api/appointments` | Reservar cita |
| DELETE | `/api/appointments/{id}` | Cancelar cita |
| GET | `/api/appointments/search` | Buscar citas desde administración |

El endpoint de búsqueda administrativa admite filtros opcionales por `dni`, `specialtyId`, `doctorId` y `date`, además de parámetros de paginación.

## 10. Autenticación y autorización

La aplicación utiliza JWT para comunicarse con la API.

El token recibido después del inicio de sesión se utiliza en las solicitudes autenticadas mediante la cabecera:

```http
Authorization: Bearer <token>
```

El frontend dispone de rutas protegidas para diferenciar las funcionalidades de pacientes y administradores.

La autorización efectiva se valida en el backend.

## 11. Organización del proyecto

El código fuente se encuentra en `src/` y se organiza principalmente en módulos:

```text
src/
├── modules/
│   ├── appointments/
│   ├── auth/
│   ├── availabilities/
│   ├── dashboard/
│   ├── doctors/
│   ├── patients/
│   ├── shared/
│   └── specialties/
├── App.jsx
└── main.jsx
```

Los módulos contienen los componentes, páginas y servicios necesarios para cada funcionalidad.

Los servicios utilizan una instancia compartida de Axios para comunicarse con el backend.

## 12. Consideraciones para la ejecución

- El backend debe estar iniciado antes de realizar operaciones desde el frontend.
- La URL de `.env.development` debe coincidir con la dirección de la API.
- El backend debe permitir las solicitudes CORS desde el origen del frontend.
- Para utilizar funciones administrativas, es necesario iniciar sesión con un usuario administrador configurado en el backend.
- Los datos persistentes se administran desde el backend mediante SQLite, no desde el frontend.

## 13. Repositorios y trabajo colaborativo

El desarrollo se realiza mediante Git y GitHub, utilizando ramas para separar funcionalidades.

- `main`: versión principal del repositorio.
- `development`: integración de funcionalidades.
- `feature/*`: desarrollo de funcionalidades individuales.
- `chore/*`: mantenimiento, documentación y limpieza.

Los cambios se integran a través de Pull Requests, previa revisión y verificación de funcionamiento.

---

**Trabajo Práctico Integrador – Desarrollo de Software 2026 – UTN FRT**
