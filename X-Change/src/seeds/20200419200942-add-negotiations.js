module.exports = {
  up: (queryInterface) => {
    const negotiationsData = [
      {
        customer: 1,
        seller: 2,
        state: 'Accepted',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        customer: 2,
        seller: 1,
        state: 'Cancelled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        customer: 2,
        seller: 1,
        state: 'In Progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('negotiations', negotiationsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('negotiations', null, {}),
};
