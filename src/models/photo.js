module.exports = (sequelize, DataTypes) => {
  const photo = sequelize.define('photo', {
    fileName: DataTypes.STRING,
  }, {});

  photo.associate = function associate(models) {
    photo.belongsTo(models.object);
  };

  return photo;
};
