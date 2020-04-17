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
  }, {});

  object.associate = function associate(models) {
    object.belongsTo(models.category);
  };

  return object;
};
