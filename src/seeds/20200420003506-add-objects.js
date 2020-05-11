module.exports = {
  up: (queryInterface) => {
    const objectsData = [
      {
        userId: 1,
        categoryId: 1,
        name: 'Vinilo Abbey Road',
        state: false,
        description: 'Álbum de los Beatles',
        views: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 2,
        name: 'The Last Of Us',
        state: true,
        description: 'Juego Original para PS4',
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 3,
        name: 'Pelota Adidas Brazuca',
        state: false,
        description: 'Original del Mundial 2014',
        views: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 4,
        name: 'Mouse Gamer Razer',
        state: true,
        description: 'Inalámbrico Usado',
        views: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('objects', objectsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('objects', null, {}),
};
