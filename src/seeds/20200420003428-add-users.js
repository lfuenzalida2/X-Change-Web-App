const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;

module.exports = {
  up: (queryInterface) => {
    const users = [
      {
        username: 'Soy Admin',
        mail: 'admin@xchange.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999052260',
        region: 'santiago',
        profilePicture: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: faker.name.findName(),
        mail: 'user@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999052261',
        region: 'temuco',
        profilePicture: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('users', users);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
