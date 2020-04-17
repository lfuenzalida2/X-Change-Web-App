module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('negotiations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    customer: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    seller: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
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

  down: (queryInterface) => queryInterface.dropTable('negotiations'),
};
