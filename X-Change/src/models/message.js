module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    negotiation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});

  message.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return message;
};
