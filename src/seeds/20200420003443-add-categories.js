module.exports = {
  up: (queryInterface) => {
    const categoriesData = [
      {
        name: 'música',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'juegos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'deportes',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'tecnología',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('categories', categoriesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('categories', null, {}),
};
