module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    userId: {
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

  user.associate = function associate() {
    
  };

  return user;
};
