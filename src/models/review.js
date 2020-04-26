module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    reviewer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
   
    },
    reviewed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
   
    },
    negotiation: {
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

  review.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return review;
};
