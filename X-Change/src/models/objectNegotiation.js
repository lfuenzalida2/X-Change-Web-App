module.exports = (sequelize, DataTypes) => {
  const objectNegotiation = sequelize.define('objectNegotiation', {
    negotiationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'negotiations',
        key: 'id',
      },
      validate: {
        notEmpty: true,
      },
    },
    objectId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'objects',
        key: 'id',
      },
      validate: {
        notEmpty: true,
      },
    },
  });

  objectNegotiation.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return objectNegotiation;
};
