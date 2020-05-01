module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('reviews', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    reviewerId: {
      type: Sequelize.INTEGER,
    },
    reviewedId: {
      type: Sequelize.INTEGER,
    },
    negotiationId: {
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
        fields: ['reviewerId', 'negotiationId'],
      },
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('reviews'),
};
