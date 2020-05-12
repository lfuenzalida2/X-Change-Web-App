module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'photos', // name of Source model
    'objectId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'objects', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }, {
      uniqueKeys: {
        objectNegotiations_unique: {
          fields: ['objectId', 'fileName'],
        },
      },
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'photo', // name of Source modelqueryInterface.removeColumn(
    'objectId', // key we want to remove
  ),
};
