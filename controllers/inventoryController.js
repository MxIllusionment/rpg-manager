module.exports = function (db) {
  return {
    // Get inventory for a character
    getInventory: (req, res) => {
      const filter = {
        where: {
          id: req.params.characterId
        },
        include: {
          model: db.Item,
          include: db.Inventory.quantity
        }
      };
      db.Character.findOne(filter)
        .then(data => res.json(data.Items));
    },

    // Add an item to a character's inventory
    addInvItem: (req, res) => {
      const filter = {
        where: {
          id: req.params.characterId
        }
      };

      db.Character.findOne(filter)
        .then(char => char.addItem(parseInt(req.body.id), { through: { quantity: 1 } }))
        .then(data => res.json(data));
    },

    // Remove an item from a character's inventory
    deleteInvItem: (req, res) => {
      const filter = {
        where: {
          id: req.params.characterId
        }
      };

      db.Character.findOne(filter)
        .then(char => char.removeItem(req.params.itemId))
        .then(data => res.json(data));
    },

    // Update the quantity of an item in a character's inventory
    updateQuantity: (req, res) => {
      const invFilter = {
        where: {
          CharacterId: req.params.characterId,
          ItemId: req.params.itemId
        }
      };

      db.Inventory.update({ quantity: req.body.quantity }, invFilter)
        .then(data => res.json(data));
    }
  };
};
