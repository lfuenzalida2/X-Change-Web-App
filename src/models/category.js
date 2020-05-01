module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  }, {});

  category.associate = function associate(models) {
    category.hasMany(models.object);
  };

  return category;
};
