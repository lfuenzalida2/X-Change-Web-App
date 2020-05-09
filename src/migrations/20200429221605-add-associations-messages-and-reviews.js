module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'messages', // name of Source model
    'senderId', // name of the key we're adding
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
    'messages', // name of Source model
    'senderId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
    },
  ),
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'messages', // name of Source model
    'receiverId', // name of the key we're adding
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
    'messages', // name of Source model
    'receiverId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
    },
  ),
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'messages', // name of Source model
    'negotiationId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'negotiations', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'messages', // name of Source model
    'negotiationId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
    },
  ),
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'reviews', // name of Source model
    'reviewerId', // name of the key we're adding
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
    'reviews', // name of Source model
    'reviewerId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
    },
  ),
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'reviews', // name of Source model
    'reviewedId', // name of the key we're adding
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
    'reviews', // name of Source model
    'reviewedId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
    },
  ),
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'reviews', // name of Source model
    'negotiationId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'negotiations', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'reviews', // name of Source model
    'negotiationId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
    },
  ),
};
