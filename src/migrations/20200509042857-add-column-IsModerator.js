module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users', // name of Source model
    'isModerator', // name of the key we're adding
    {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'users', // name of Source modelqueryInterface.removeColumn(
    'isModerator', // key we want to remove
  ),
};
