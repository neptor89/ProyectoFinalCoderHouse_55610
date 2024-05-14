### README ###

# Proyecto Final del Curso de Programación Backend - CoderHouse

Este es el proyecto final del curso de Programación Backend de CoderHouse, donde se desarrolló un ecommerce desde cero utilizando Express, Node.js y Handlebars.

## Descripción del Proyecto

El proyecto consiste en la creación de un ecommerce completo, que permite a los usuarios navegar por diferentes categorías de productos, agregar productos al carrito de compras, realizar pedidos y realizar pagos. El frontend está implementado utilizando el motor de plantillas Handlebars, mientras que el backend está construido con Express y Node.js.

## Características Principales

- **Navegación de Productos:** Los usuarios pueden explorar diferentes categorías de productos y ver los detalles de cada producto.
- **Carrito de Compras:** Los usuarios pueden agregar productos al carrito de compras, ver el resumen del carrito y proceder al proceso de pago.
- **Proceso de Pedido:** Los usuarios pueden completar el proceso de pedido ingresando su información de envío y método de pago.
- **Integración de Pago:** El proyecto cuenta con integración de pago utilizando una pasarela de pago externa (se debe proporcionar más información sobre la pasarela de pago utilizada).

## Instalación

1.  Clona este repositorio en tu máquina local.
2.  Instala las dependencias del proyecto utilizando npm:

```
npm install
```

1.  Crea un archivo **.env** en la carpeta **config** dentro de la raíz del proyecto y configura las variables de entorno necesarias según el archivo **.env.example**.
2.  Inicia la aplicación:

```
npm start
```

## Roles de Usuario y Credenciales

Existen distintos roles de usuario en la aplicación:

- **Admin:** Puede crear, eliminar y modificar productos, gestionar usuarios (cambiar su rol a premium y borrarlos), y gestionar carritos y tickets. Las credenciales de administrador son:

  - Email: adminCoder@coder.com
  - Contraseña: 12345qwert

- **User:** Puede realizar un proceso de compra completo.
- **Premium:** Además de las funciones de usuario, puede crear productos y editar y borrar sus propios productos.

## Funcionalidades de Envío de Correos

El ecommerce utiliza NodeMailer para el envío de correos en las siguientes situaciones:

- Se envía un email a un usuario premium cuando se elimina uno de sus productos.
- Se envía un email a los usuarios borrados por inactividad.
- Se envía un email al finalizar una compra con toda la información de la misma.
- El ecommerce dispone de un sistema de reseteado de contraseña protegido que funciona a través del envío de email con verificación.

## Pruebas y Documentación

Se han realizado pruebas de rendimiento y tests unitarios y de integración mediante mocha, chai y supertest. Además, la documentación de la API está disponible en Swagger en el endpoint **/api/docs**, donde se pueden probar todos los endpoints (se requieren credenciales de administrador para muchos de ellos).
