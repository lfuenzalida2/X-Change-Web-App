module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('objects', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    userId: {
      type: Sequelize.INTEGER,
    },

    name: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.BOOLEAN,
    },
    description: {
      type: Sequelize.TEXT,
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

  down: (queryInterface) => queryInterface.dropTable('objects'),
};
