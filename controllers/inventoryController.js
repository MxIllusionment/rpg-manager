module.exports = function (db) {
  return {
    // Get inventory for a character
    getInventory: (req, res) => {
      const filter = {
        where: {
          id: req.params.characterId
        },
        include: {
          model: db.Item
        }
      };
      db.Character.findOne(filter)
        .then(data => res.json(data));
    },

    // Add an item to a character's inventory
    addInvItem: (req, res) => {
      const filter = {
        where: {
          id: req.params.characterId
        }
      };

      db.Character.findOne(filter)
        .then(char => char.addItem(req.body.id, { through: { quantity: 1 } }))
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
        .then(char => char.removeItem(req.params.id))
        .then(data => res.json(data));
    },

    // Update the quantity of an item in a character's inventory
    updateQuantity: (req, res) => {
      const charFilter = {
        where: {
          id: req.params.characterId
        }
      };

      const itemFilter = {
        where: {
          id: req.params.itemId
        }
      };

      db.Character.findOne(charFilter)
        .then(char => char.getItems(itemFilter))
        .then(items => {
          items[0].Inventory.quantity = req.body.quantity;
          return items[0].Inventory.save();
        })
        .then(data => res.json(data));
    }

  };
};
