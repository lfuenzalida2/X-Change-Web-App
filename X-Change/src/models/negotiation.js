module.exports = (sequelize, DataTypes) => {
  const negotiation = sequelize.define('negotiation', {
    customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seller: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});

  negotiation.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return negotiation;
};
