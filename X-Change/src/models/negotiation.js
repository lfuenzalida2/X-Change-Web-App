module.exports = (sequelize, DataTypes) => {
  const negotiation = sequelize.define('negotiation', {
    customer: DataTypes.INTEGER,
    seller: DataTypes.INTEGER,
    state: DataTypes.STRING,
  }, {});

  negotiation.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return negotiation;
};
