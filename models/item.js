module.exports = function (sequelize, DataTypes) {
  const Item = sequelize.define('Item', {
    name: { type:
        DataTypes.STRING,
    allowNull: false
    },
    description: DataTypes.TEXT
  });

  Item.associate = function (models) {
    Item.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Item;
};
