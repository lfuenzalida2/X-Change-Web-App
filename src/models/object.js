module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define('object', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    state: DataTypes.BOOLEAN,
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      },
    },
    views: DataTypes.INTEGER,
  }, {});

  object.associate = function associate(models) {
    object.belongsTo(models.category);
    object.belongsTo(models.user);

    object.hasMany(models.photo);
    object.belongsToMany(models.negotiation, { through: 'objectNegotiation' });
  };

  return object;
};
