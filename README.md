# Que es X-Change

X-Change es un página Web que te permite tomar esas cosas que tenias guardando polvo o que te querías deshacer e intercambiarlas por cosas que tu quieras! Para esto debes ingresar a https://notxchange.herokuapp.com/, crear una cuenta, agregar elementos que quieras intercambiar y comenzar a negociar con otros usuarios! Nosotros nos encargamos de poner un lugar de encuentro para que los X-Changes funcionen, pero no nos hacemos cargo de los intercambios ni de las negociaciones, solo de temas administrativos con respecto a la página.

# Link al HEROKU

[link](https://notxchange.herokuapp.com/)
https://notxchange.herokuapp.com/

# Servicios de terceros

Para levantar la página Web usamos Heroku <br>
Para almacenar las imágenes e iconos de la aplicación en la nube usamos Amazon S3<br>
Las contraseñas estan encriptadas con el paquete `bcrypt`<br>
Para enviar emails utilizamos los servicios de Sendgrid<br>
Utilizamos el paquete `socket.io` para establecer conexiones en tiempo real, implementadas en el chat de las negociaciones, y las notificaciones push.
Para realizar seeds aleatorias utilizamos el paquete `Faker`.
Para guardar las variables de entorno utilizamos el paquete `dotenv`.
Para realizar busqueda dentro de la base de datos utilizamos `sequelize` y el paquete `Fuse`.
Para realizar requests al servidor utilizamos el paquete `axios`.
Para medir el tiempo en los mensajes y notificaciones utilizamos el paquete `smart-time-ago`.


# A modo de Testeo

Actualmente hay 2 cuentas disponibles, una de admin y una de usuario normal<br>
Para loguearse usar:<br>
correo: admin@xchange.com contrseña: 12345678<br>
correo: user@example.com contraseña: 12345678<br>

Para poder ver el perfil de una persona se debe recibir una review de esta, luego en la pagina "Profile" aparecerá la review, esta te permite ver el perfil de la persona que la hizo <br>

# Cosas a tener en consideración

Como grupo asumimos que cada vez que hay un cambio exitoso los objetos intercambiados dejan de estar disponible para el dueño y nada mas, no colocamos el objeto en el inventario de la otra persona, esto es por dos razones. Primero, la idea de intercambiar es buscar un objeto que uno quiere, por ende no es intuitivo colocar automaticamente el objeto como si fuera a intercambiarlo, además de que si la persona quiere cambiar ese objeto siempre puede volver a subirlo a la página. Segundo, nuestra página solo se encarga de hacer el enlace entre las personas y objetos, no nos encargamos del intercambio, por ende si es que llegase a fallar el intercambio físico nosotros no tenemos manera de saberlo y tampoco es de nuestro interes medirlo. <br>

Una persona puede realizar una review luego de negociar, ya sea que haya sido una negociación exitosa o una negociación fallida, esto es porque si una persona siempre está tratando de realizar negociaciones "injustas" (nos referimos a que la persona siempre pide mas de lo que se "merece" por sus productos o incluso, no realiza negociaciones de manera justa) se puede advertir a los demás usuarios que esta persona es una persona dificíl de negociar.<br>

Un usuario no puede quitar elementos de la negociación una vez ya aceptó, esto es porque puede estafar a la otra persona tratando de hacer algún movimiento a ultimo segundo.<br>

Los objetos que no estan disponibles permanecen en el inventario, esto es para poder llevar un historial de los objetos.
