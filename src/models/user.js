const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [4, 25],
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
        notEmpty: true,
      },
    },
    number: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
      },
    },
    region: DataTypes.STRING,
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: 'account.png',
    },

    isModerator: DataTypes.BOOLEAN,
  }, {});

  user.beforeCreate(buildPasswordHash);
  user.beforeUpdate(buildPasswordHash);

  user.associate = function associate(models) {
    user.hasMany(models.object);
    // has many negotiations
    user.hasMany(models.negotiation, {
      foreignKey: {
        name: 'customerId',
      },
      as: 'negotiationsGotten',
    });
    user.hasMany(models.negotiation, {
      foreignKey: {
        name: 'sellerId',
      },
      as: 'negotiationsStarted',
    });
    // through reviews
    user.hasMany(models.review, {
      foreignKey: {
        name: 'reviewerId',
      },
      as: 'reviewsDone',
    });
    user.hasMany(models.review, {
      foreignKey: {
        name: 'reviewedId',
      },
      as: 'reviewsGotten',
    });
    // through messages
    user.hasMany(models.message, {
      foreignKey: {
        name: 'senderId',
      },
      as: 'messagesSent',
    });
    user.hasMany(models.message, {
      foreignKey: {
        name: 'receiverId',
      },
      as: 'messagesReceived',
    });

    user.hasOne(models.session);
    user.hasMany(models.notification);
  };

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
