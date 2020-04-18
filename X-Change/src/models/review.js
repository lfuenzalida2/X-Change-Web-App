module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    reviewer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    negotiation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    text: {
      type: DataTypes.TEXT,
    },
  }, {});

  review.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return review;
};
