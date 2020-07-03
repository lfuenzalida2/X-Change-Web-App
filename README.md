# Que es X-Change

X-Change es un página Web que te permite tomar esas cosas que tenias guardando polvo o que te querías deshacer e intercambiarlas por cosas que tu quieras! Para esto debes ingresar a https://notxchange.herokuapp.com/, crear una cuenta, agregar elementos que quieras intercambiar y comenzar a negociar con otros usuarios! Nosotros nos encargamos de poner un lugar de encuentro para que los X-Changes funcionen, pero no nos hacemos cargo de los intercambios ni de las negociaciones, solo de temas administrativos con respecto a la página.

La aplicación Web está construida usando una arquitectura del tipo: Modelo-Vista-Controlador. El modelo de datos está representado a través de un diagrama de Entidad-Relación, y se puede encontrar en este mismo repositorio en `docs/EntityRelationDiagram`.

Un dato curioso de la implementación, es que cada mensaje en el chat de las negociaciones, posee un atributo que identifica el idioma al que pertenece. Para ver más detalles sobre su uso, consultar la sección _A modo de Testeo y Uso_.

# Link al HEROKU

[link](https://notxchange.herokuapp.com/)
https://notxchange.herokuapp.com/

# Navegabilidad

La navegabilidad de la página se puede hacer completamente a partir de botones y links, no es neceasario ingresar ninguna ruta.

# Servicios de terceros

* Para levantar la página Web usamos `Heroku`  
* Para almacenar las imágenes e iconos de la aplicación en la nube usamos `Amazon S3`
* Las contraseñas estan encriptadas con el paquete `bcrypt`
* Para enviar emails utilizamos los servicios de `Sendgrid`
* Utilizamos el paquete `socket.io` para establecer conexiones en tiempo real, implementadas en el chat de las negociaciones, y las notificaciones push.
* Para la traducción de mensajes de chats y resultados de búsquedas se utilizó la API ``Systran``.
* Se utiliza `JWT` para la creacion de tokens en la REST API.

# A modo de Testeo y Uso

Actualmente hay 2 cuentas disponibles, una de admin y una de usuario normal 
Para loguearse usar: 
correo: admin@xchange.com contrseña: 12345678 
correo: user@example.com contraseña: 12345678 

Para poder ver el perfil de una persona se debe presionar en su foto de perfil. 
En un chat, al escoger un idioma y traducir, se podrán ver todos los mensajes en el idioma seleccionado, y cada vez que se envíe un mensaje, este se guardará con un atributo "language" correspondiente al idioma seleccionado, permitiendo que los otros usuarios puedan ver la traducción independiente del idioma. Análogo para los resultados de la búsqueda rellenando el campo "Idioma".

# API REST ofrecida por X-Change

La API presenta las siguientes funcionalidades, todas autentificadas salvo que se indique: 
- POST Autentificación: ``notxchange.herokuapp.com/api/auth`` (Sin autentificar). \
  El body debe contener ``{ mail: string, password: string }``. Retorna un JWT que permite utilizar los métodos autentificados.
- GET Obtener categorías: ``notxchange.herokuapp.com/api/categories`` (Sin autentificar). \
- POST Búsqueda de objetos: ``notxchange.herokuapp.com/api/objects/search``.  \
  El body debe contener ``{ state: bool, region: string, categoryId: int, keywords: string }`` , region debe ser 'todas' ó el nombre completo de las regiones de Chile.
- POST Publicar objeto: ``notxchange.herokuapp.com/api/objects/new``. \
  El body debe contener ``{ name: string, description: string, categoryId: int }``
- GET Obtener negociaciones: ``notxchange.herokuapp.com/api/negotiations``
- ├── GET Obtener negociación: ``notxchange.herokuapp.com/api/negotiations/:id``
- ├── GET Obtener mensajes de una negociación: ``notxchange.herokuapp.com/api/negotiations/:id/messages``
- └── POST Enviar mensaje de una negociación: ``notxchange.herokuapp.com/api/negotiations/:id/messages/new``. \
  El body debe contener ``{ text: string }``
- GET Mi inventario: ``notxchange.herokuapp.com/api/objects/inventory``
- GET Mis Notificaciones: ``notxchange.herokuapp.com/api/notifications``
