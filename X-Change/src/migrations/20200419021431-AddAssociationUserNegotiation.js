module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'negotiations', // name of Source model
    'customer', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'negotiations', // name of Source model
    'customer', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  ),
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'negotiations', // name of Source model
    'seller', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'negotiations', // name of Source model
    'seller', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  ),
};
