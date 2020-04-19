module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'objectNegotiations',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      objectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'objects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      negotiationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'negotiations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
  ),
  down: (queryInterface) => {
    // remove table
    queryInterface.dropTable(
      'objectNegotiations',
    );
  },
};
