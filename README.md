# Fake Instagram

## Descripción

Servidor web creado con Express + MongoDB con la finalidad de dar soporte al proyecto final de la materia Desarrollo Web y Mobile 2024

## Instalar dependencias

- Ejecutar npm install dentro de la carpeta api-node

## Instalar MongoDB local

- Navegar a [https://www.mongodb.com/docs/manual/installation/](https://www.mongodb.com/docs/manual/installation/) y elegir la versión Community para el SO que corresponda. Seguir las instrucciones de instalación que allí aparecen. Las instrucciones de instalación también explican cómo levantar una instancia de MongoDB con la cual conectarse.

## Instalar MongoDB Compass

- MongoDB Compass es una GUI de escritorio, que permite conectarse con una instancia de MongoDB y poder explorar las diferentes colecciones de información. Para instalarlo, navegar a [https://www.mongodb.com/try/download/shell](https://www.mongodb.com/try/download/shell) y seguir los pasos.

## Levantar el proyecto

- Una vez instaladas las dependencias del servidor y se tiene un servicio de MongoDB levantado, editar el archivo .env cambiando el valor de las variables MONGO_URI y MONGO_PASS por los valores correspondientes a su instancia local (por defecto: mongodb://localhost:27017/instagram y password vacío).
- Ejecutar npm run start para levantar el servidor

## Documentación del servidor

- El servidor cuenta con un Swagger, que permite explorar los diferentes endpoints que el servidor proveé. Para acceder al mismo, navegar a http://localhost:3001/api-docs/
