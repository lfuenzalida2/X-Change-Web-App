module.exports = {
  up: (queryInterface) => {
    const objectsData = [
      {
        userId: 1,
        categoryId: 1,
        name: 'caja',
        state: true,
        description: 'Esto hace como caja',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 2,
        name: 'the last of us',
        state: true,
        description: 'Esto hace como joel',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 1,
        name: 'perro',
        state: false,
        description: 'Esto hace como perro',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 3,
        name: 'gato',
        state: true,
        description: 'Esto hace como gato',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 4,
        name: 'pato',
        state: true,
        description: 'Esto hace como pato',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('objects', objectsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('objects', null, {}),
};
