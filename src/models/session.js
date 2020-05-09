module.exports = (sequelize, DataTypes) => {
  const session = sequelize.define('session', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      validate: {
        notEmpty: true,
      },
    },
    token: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {});

  session.associate = function associate(models) {
    session.belongsTo(models.user);
  };

  return session;
};
