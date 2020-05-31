module.exports = (sequelize, DataTypes) => {
  const negotiation = sequelize.define('negotiation', {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerId: {
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

    negotiation.belongsTo(models.user, { as: 'customer' });
    negotiation.belongsTo(models.user, { as: 'seller' });

    negotiation.hasMany(models.message);
    negotiation.hasMany(models.review);
    negotiation.hasMany(models.notification);
  };

  return negotiation;
};
