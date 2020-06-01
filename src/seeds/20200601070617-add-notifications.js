module.exports = {
  up: (queryInterface) => {
    const notificationsData = [
      {
        type: 'newNegotiation',
        userId: 1,
        negotiationId: 1,
        seen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 7,
        negotiationId: 2,
        seen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 9,
        negotiationId: 3,
        seen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 5,
        negotiationId: 4,
        seen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 2,
        negotiationId: 5,
        seen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 3,
        negotiationId: 6,
        seen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 2,
        negotiationId: 12,
        seen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 3,
        negotiationId: 13,
        seen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 10,
        negotiationId: 16,
        seen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'newNegotiation',
        userId: 1,
        negotiationId: 25,
        seen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('notifications', notificationsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('notifications', null, {}),
};
