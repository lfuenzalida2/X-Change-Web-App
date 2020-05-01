module.exports = {
  up: (queryInterface) => {
    const objectsData = [
      {
        userId: 1,
        categoryId: 1,
        name: 'Vinilo Abbey Road',
        state: false,
        description: 'Álbum de los Beatles',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 2,
        name: 'The Last Of Us',
        state: true,
        description: 'Juego Original para PS4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 3,
        name: 'Pelota Adidas Brazuca',
        state: false,
        description: 'Original del Mundial 2014',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 4,
        name: 'Mouse Gamer Razer',
        state: true,
        description: 'Inalámbrico Usado',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('objects', objectsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('objects', null, {}),
};
