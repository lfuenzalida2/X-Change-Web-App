module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('photos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    photoIdentificator: {
      type: Sequelize.STRING,
      unique: true,
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

  down: (queryInterface) => queryInterface.dropTable('photos'),
};
