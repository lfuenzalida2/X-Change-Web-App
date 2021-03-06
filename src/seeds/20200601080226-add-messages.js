module.exports = {
  up: (queryInterface) => {
    const messagesData = [
      {
        senderId: 1,
        receiverId: 2,
        text: 'Hola, quiero ese albúm de los Beatles',
        negotiationId: 1,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 2,
        receiverId: 1,
        text: 'Bueno, yo quiero a cambio la bateria.',
        negotiationId: 1,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 1,
        receiverId: 2,
        text: 'mmmmm, no estoy tan seguro',
        negotiationId: 1,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 1,
        receiverId: 2,
        text: 'Déjame pensarlo...',
        negotiationId: 1,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 1,
        receiverId: 2,
        text: 'Está bien, acepto el trato!',
        negotiationId: 1,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 2,
        receiverId: 1,
        text: 'Súper, es un trato entonces!',
        negotiationId: 1,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 9,
        receiverId: 1,
        text: 'Hola, me gustaría adquirir ese refrigerador,con qué objeto mio estarías dispuesto  a intercambiar?',
        negotiationId: 3,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 1,
        receiverId: 9,
        text: 'mmm A ver, que tal la guitarra?',
        negotiationId: 3,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 9,
        receiverId: 1,
        text: 'Por supuesto! es un trato?',
        negotiationId: 3,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 1,
        receiverId: 9,
        text: 'Es un trato!',
        negotiationId: 3,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 2,
        receiverId: 1,
        text: 'Hola hola, cómo va, se ve  interesante es juego de ahí',
        negotiationId: 5,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 2,
        receiverId: 1,
        text: 'Te ofrezco mi bicicleta por el juego!',
        negotiationId: 5,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 1,
        receiverId: 2,
        text: '...',
        negotiationId: 5,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 1,
        receiverId: 2,
        text: '...',
        negotiationId: 5,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 1,
        receiverId: 2,
        text: 'Esa bicicleta no puedo estar más cochina',
        negotiationId: 5,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 2,
        receiverId: 1,
        text: 'Veo que no estás listo para tener esta conversación. AD1ÓS',
        negotiationId: 5,
        language: 'es',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('messages', messagesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('messages', null, {}),
};
