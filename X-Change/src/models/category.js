module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
  }, {});

  category.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return category;
};
