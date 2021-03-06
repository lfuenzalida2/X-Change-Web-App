const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;
const date = new Date();
date.setMonth(date.getMonth() - 1);

module.exports = {
  up: (queryInterface) => {
    const users = [
      {
        username: 'Soy Admin',
        mail: 'admin@xchange.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999052260',
        region: 'Metropolitana de Santiago',
        profilePicture: 'account.png',
        isModerator: true,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'user@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999052261',
        region: 'La Araucania',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'usuario_1@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999052262',
        region: 'Los Lagos',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'usuario_2@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999052263',
        region: 'Los Rios',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'usuario_3@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999057861',
        region: 'Antofagasta',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'usuario_4@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999079461',
        region: 'Arica y Parinacota',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'usuario_5@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999052261',
        region: 'Metropolitana de Santiago',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'usuario_6@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '999052781',
        region: 'Coquimbo',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'usuario_7@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '991232261',
        region: 'Magallanes y de la Antartica Chilena',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        username: faker.name.findName(),
        mail: 'usuario_8@example.com',
        password: bcrypt.hashSync('12345678', PASSWORD_SALT),
        number: '564052261',
        region: 'Atacama',
        profilePicture: 'account.png',
        isModerator: false,
        createdAt: date,
        updatedAt: date,
      },
    ];

    return queryInterface.bulkInsert('users', users);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
