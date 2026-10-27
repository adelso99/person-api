# API de personas

API REST desarrollada con Node.js, Express, Sequelize y SQL Server.

Permite crear, consultar, actualizar y desactivar personas. La eliminación
es lógica: el registro permanece en la tabla con active = false.

## Requisitos

- Node.js 24.
- SQL Server instalado y en ejecución.
- Acceso a SQL Server para crear la base de datos y configurar un usuario.
- TCP/IP habilitado en SQL Server y puerto 1433 accesible desde la API.

## Instalación

Desde la carpeta del proyecto, ejecutar:

```bash
npm ci
```

Este comando instala las dependencias usando las versiones registradas
en `package-lock.json`.


## Preparar la base de datos

1. Conectarse a SQL Server mediante SQL Server Management Studio (SSMS).
2. Abrir el archivo `database.sql` incluido en este proyecto.
3. Ejecutarlo para crear la base de datos `person_db` y la tabla `person`.

El script está pensado para una instalación inicial. Si la base o la
tabla ya existen, no ejecutar nuevamente las instrucciones CREATE.

Para conectar la API con un usuario y contraseña de SQL Server:

- Habilitar el modo de autenticación de Windows y SQL Server (modo mixto).
- Reiniciar el servicio si se cambia el modo de autenticación.
- Crear un login de SQL Server y su usuario asociado en `person_db`.
- Conceder permisos SELECT, INSERT y UPDATE sobre `dbo.person`.

La API realiza eliminación lógica mediante UPDATE, por lo que no necesita
permiso DELETE sobre la tabla.

## Variables de entorno

Crear `.env.local` copiando la plantilla. En CMD de Windows:

```cmd
copy .env.example .env.local
```

Editar `.env.local` con los datos de la conexión:

```env
ENV=local
DB_USER=usuario_sql
DB_PASS="tu_contraseña"
DB_NAME=person_db
DB_SERVER=localhost
```

Los valores de usuario y contraseña son ejemplos y deben reemplazarse.
No incluir `.env.local` en el repositorio.

La conexión usa el puerto 1433, configurado en `src/utils/db.js`.

## Ejecutar la API

Para desarrollo:

```bash
npm run dev
```

Este comando establece NODE_ENV=development, carga `.env.local` y reinicia
el servidor automáticamente cuando cambia el código.

Para ejecutar sin reinicio automático:

```bash
npm start
```

Este comando establece NODE_ENV=production y carga `.env`.
Antes de utilizarlo, configurar ese archivo con las variables de conexión.

El servidor escucha en:

http://localhost:3000

## Documentación Swagger

Con la API ejecutándose, abrir:

http://localhost:3000/api-docs

La documentación muestra los parámetros, cuerpos de petición,
ejemplos y respuestas de los seis endpoints.

Para probar una operación, desplegarla y seleccionar
"Try it out" y luego "Execute".

Las peticiones ejecutadas desde Swagger usan la base de datos configurada
y pueden crear, modificar o desactivar registros.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /person | Listar personas activas |
| POST | /person | Crear una persona activa |
| GET | /person/:id | Consultar una persona activa |
| PUT | /person/:id | Actualizar nombre y apellido; requiere ambos |
| PATCH | /person/:id | Actualizar nombre, apellido o ambos |
| DELETE | /person/:id | Desactivar una persona |

POST, PUT y PATCH reciben cuerpos JSON.

PUT y PATCH solo permiten modificar names y lastname.
Una persona inactiva no puede consultarse, actualizarse ni desactivarse nuevamente.

## Códigos de respuesta

| Código | Significado |
|--------|-------------|
| 200 | Consulta o actualización exitosa |
| 201 | Persona creada |
| 204 | Persona desactivada; respuesta sin contenido |
| 400 | Datos de entrada inválidos |
| 404 | Persona inexistente o inactiva |
| 500 | Error interno del servidor |