module.exports = {
  up: (queryInterface) => {
    const categoriesData = [
      {
        name: 'musica',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'deporte',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'juegos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'tecnologia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('categories', categoriesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('categories', null, {}),
};
