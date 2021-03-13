module.exports = function (sequelize, DataTypes) {
  const Character = sequelize.define('Character', {
    name: { type:
      DataTypes.STRING,
    allowNull: false
    },
    description: DataTypes.TEXT,
    game: DataTypes.TEXT
  });

  Character.associate = function (models) {
    Character.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Character;
};
