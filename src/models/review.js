module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    reviewedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    negotiationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'negotiation',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        max: 5,
        min: 1,
      },
    },
    text: {
      type: DataTypes.TEXT,
    },
  }, {});

  review.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    review.belongsTo(models.user, { as: 'reviewer' });
    review.belongsTo(models.user, { as: 'reviewed' });
    review.belongsTo(models.negotiation);
  };

  return review;
};
