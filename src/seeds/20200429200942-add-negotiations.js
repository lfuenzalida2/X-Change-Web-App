module.exports = {
  up: (queryInterface) => {
    const negotiationsData = [
      {
        customerId: 1,
        sellerId: 2,
        state: 'Accepted',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        customerId: 2,
        sellerId: 1,
        state: 'Cancelled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        customerId: 2,
        sellerId: 1,
        state: 'In Progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('negotiations', negotiationsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('negotiations', null, {}),
};
