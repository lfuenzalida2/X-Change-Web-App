module.exports = {
  up: (queryInterface) => {
    const objectNegotiationsData = [
      {
        negotiationId: 1,
        objectId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        negotiationId: 1,
        objectId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        negotiationId: 1,
        objectId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        negotiationId: 2,
        objectId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        negotiationId: 2,
        objectId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('objectNegotiations', objectNegotiationsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('objectNegotiations', null, {}),
};
