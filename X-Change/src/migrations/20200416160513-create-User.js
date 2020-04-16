module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id_user: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    username: {
      type: Sequelize.STRING,
    },
    mail: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    number: {
      type: Sequelize.STRING,
    },
    region: {
      type: Sequelize.STRING,
    },
    profile_picture: {
      type: Sequelize.STRING,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('Users'),
};
