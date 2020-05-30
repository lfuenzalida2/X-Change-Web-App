module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define('notification', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    negotiationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'negotiation',
        key: 'id',
      },
    },
    seen: {
      type: DataTypes.BOOLEAN,
    },
  }, {});

  notification.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    notification.belongsTo(models.user);
    notification.belongsTo(models.negotiation);
  };

  return notification;
};
