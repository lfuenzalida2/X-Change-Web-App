module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'objects', // name of Source model
    'userId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'objects', // name of Source modelqueryInterface.removeColumn(
    'userId', // key we want to remove
  ),
};
