module.exports = function (sequelize, DataTypes) {
  const Inventory = sequelize.define('Inventory', {
    quantity: DataTypes.INTEGER
  }, { timestamps: false });

  Inventory.associate = function (models) {
    models.Item.belongsToMany(models.Character, { through: Inventory });
    models.Character.belongsToMany(models.Item, { through: Inventory });
  };

  return Inventory;
};
