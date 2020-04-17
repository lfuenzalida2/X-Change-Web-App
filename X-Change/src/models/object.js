module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define('object', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
  }, {});

  object.associate = function associate(models) {
    object.belongsTo(models.category);
  };

  return object;
};
