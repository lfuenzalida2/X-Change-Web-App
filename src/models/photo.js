module.exports = (sequelize, DataTypes) => {
  const photo = sequelize.define('photo', {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    objectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'objects',
        key: 'id',
      },
      validate: {
        notEmpty: true,
      },
    },
  });

  photo.associate = function associate(models) {
    photo.belongsTo(models.object);
  };

  return photo;
};
