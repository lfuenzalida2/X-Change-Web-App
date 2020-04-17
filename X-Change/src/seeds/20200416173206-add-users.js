module.exports = {
  up: (queryInterface) => {
    const Users = [
      {
        username: 'Lukas Fuenzalida',
        mail: 'lukasafa@gmail.com',
        password: 'asd',
        number: '999052260',
        region: 'temuco',
        profile_picture: 'asdasdsasda',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Rafael Fuenzalida',
        mail: 'lukasaf@gmail.com',
        password: 'Holaaaa123',
        number: '999052260',
        region: 'temuco',
        profile_picture: 'asdasdsasda',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('Users', Users);
  },

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
