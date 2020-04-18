module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('reviews', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    reviewer: {
      type: Sequelize.INTEGER,
    },
    reviewed: {
      type: Sequelize.INTEGER,
    },
    negotiation: {
      type: Sequelize.INTEGER,
    },
    rating: {
      type: Sequelize.INTEGER,
    },
    text: {
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
  }, {
    uniqueKeys: {
      reviews_unique: {
        fields: ['reviewer', 'negotiation'],
      },
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('reviews'),
};
