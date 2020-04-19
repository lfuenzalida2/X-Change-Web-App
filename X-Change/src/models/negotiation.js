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

  negotiation.associate = function associate(models) {
    negotiation.belongsToMany(models.object, { through: 'objectNegotiation' });
  };

  return negotiation;
};
