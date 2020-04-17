module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
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
        len: [8, ],
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

  User.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return User;
};
