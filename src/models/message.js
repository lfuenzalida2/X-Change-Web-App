module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    receiverId: {
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
    text: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      },
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'es',
    },
  }, {});

  message.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    message.belongsTo(models.user, { as: 'sender' });
    message.belongsTo(models.user, { as: 'receiver' });
    message.belongsTo(models.negotiation);
  };

  return message;
};
