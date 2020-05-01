module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('negotiations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    customerId: {
      type: Sequelize.INTEGER,
    },
    sellerId: {
      type: Sequelize.INTEGER,
    },
    state: {
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

  down: (queryInterface) => queryInterface.dropTable('negotiations'),
};
