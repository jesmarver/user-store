# Rest Project Node.js + TypeScript

Este proyecto es un ejemplo de una API REST desarrollada con Node.js + express.

Entre sus contenidos destacan:
- Autenticación con JWT (login y registro)
- CRUD para products y categories.
- Patrón repositorio
- MongoDb con Docker.
- Middlewares de autenticación para creación de products y categories.
- Encriptación de contraseñas



## Instalación

1. Clonar .env.template a .env y configurar las variables de entorno
2. Ejecutar `npm install` para instalar las dependencias
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
4. Llenar la base de datos con los datos de prueba ejecutando `npm run seed`
5. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo


