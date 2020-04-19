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
      // through reviews
    negotiation.belongsToMany(models.user, { 
      through: 'reviews',
      foreignKey: {
        name: 'customer'
      }});
    negotiation.belongsToMany(models.user, { 
      through: 'reviews',
      foreignKey: {
        name: 'seller'
      }});
      // through messages
    negotiation.belongsToMany(models.user, { 
      through: 'messages',
      foreignKey: {
        name: 'customer'
      }});
    negotiation.belongsToMany(models.user, { 
      through: 'messages',
      foreignKey: {
        name: 'seller'
      }});
};

  return negotiation;
};
