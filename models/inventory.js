module.exports = function (sequelize, DataTypes) {
  const Item = require('./item');
  const Character = require('./character');

  const Inventory = sequelize.define('Inventory', {
    quantity: DataTypes.INTEGER
  }, { timestamps: false });
  Item.belongsToMany(Character, { through: Inventory });
  Character.belongsToMany(Item, { through: Inventory });

  return Inventory;
};
