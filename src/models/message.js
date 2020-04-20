module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
   
    },
    receiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
   
    },
    negotiation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'negotiation',
        key: 'id'
      }
   
    },
    text: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      },
    },
  }, {});

  message.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return message;
};
