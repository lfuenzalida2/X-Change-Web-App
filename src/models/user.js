module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [4, 50],
      },
    },
    mail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8,],
        isInt: true,
      },
    },
    number: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
      },
    },
    region: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
  }, {});

  user.associate = function associate(models) {
    user.hasMany(models.object);
    // has many negotiations
    user.hasMany(models.negotiation, {
      foreignKey: {
        name: 'customer',
      },
    });
    // through reviews
    user.belongsToMany(models.negotiation, {
      through: 'reviews',
      foreignKey: {
        name: 'id',
      },
    });
    // through messages
    user.belongsToMany(models.negotiation, {
      through: 'messages',
      foreignKey: {
        name: 'id',
      },
    });
  };

  return user;
};
