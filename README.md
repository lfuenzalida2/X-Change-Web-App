# Que es X-Change

X-Change es un página Web que te permite tomar esas cosas que tenias guardando polvo o que te querías deshacer e intercambiarlas por cosas que tu quieras! Para esto debes ingresar a https://notxchange.herokuapp.com/, crear una cuenta, agregar elementos que quieras intercambiar y comenzar a negociar con otros usuarios! Nosotros nos encargamos de poner un lugar de encuentro para que los X-Changes funcionen, pero no nos hacemos cargo de los intercambios ni de las negociaciones, solo de temas administrativos con respecto a la página.

# Link al HEROKU

[link](https://notxchange.herokuapp.com/)
https://notxchange.herokuapp.com/

# Navegabilidad

La navegabilidad de la página se puede hacer completamente a partir de botones y links, no es neceasario ingresar ninguna ruta.

# Servicios de terceros

Para levantar la página Web usamos Heroku  
Para almacenar las imágenes e iconos de la aplicación en la nube usamos Amazon S3 
Las contraseñas estan encriptadas con el paquete `bcrypt` 
Para enviar emails utilizamos los servicios de Sendgrid 
Utilizamos el paquete `socket.io` para establecer conexiones en tiempo real, implementadas en el chat de las negociaciones, y las notificaciones push.

# A modo de Testeo

Actualmente hay 2 cuentas disponibles, una de admin y una de usuario normal 
Para loguearse usar: 
correo: admin@xchange.com contrseña: 12345678 
correo: user@example.com contraseña: 12345678 

Para poder ver el perfil de una persona se debe recibir una review de esta, luego en la pagina "Profile" aparecerá la review, esta te permite ver el perfil de la persona que la hizo  
