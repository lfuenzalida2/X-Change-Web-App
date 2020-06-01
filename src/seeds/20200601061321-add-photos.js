module.exports = {
  up: (queryInterface) => {
    const photosData = [
      {
        fileName: '0.jpeg',
        objectId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1.jpg',
        objectId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '2.jpeg',
        objectId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '3.jpg',
        objectId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '4.jpeg',
        objectId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '5.jpg',
        objectId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '6.jpg',
        objectId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '7.jpeg',
        objectId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '8.jpeg',
        objectId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '9.jpg',
        objectId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '10.png',
        objectId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '11.jpg',
        objectId: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '12.jpeg',
        objectId: 27,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '13.jpeg',
        objectId: 28,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '14.jpg',
        objectId: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '15.jpg',
        objectId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '16.jpg',
        objectId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('photos', photosData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('photos', null, {}),
};
