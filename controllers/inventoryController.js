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

      // Checks that user has permission to modify this character's inventory
      db.Character.findOne(filter)
        .then(char => {
          if (req.session.passport && char.UserId === req.session.passport.user.id) {
            char.removeItem(req.params.itemId)
              .then(data => res.json(data));
          } else {
            res.status(400).end();
          }
        });
    },

    // Update the quantity of an item in a character's inventory
    updateQuantity: (req, res) => {
      const invFilter = {
        where: {
          CharacterId: req.params.characterId,
          ItemId: req.params.itemId
        }
      };
      const charFilter = {
        where: {
          id: req.params.characterId
        }
      };

      // Checks that user has permission to modify this character's inventory
      db.Character.findOne(charFilter)
        .then(char => {
          if (req.session.passport && char.UserId === req.session.passport.user.id) {
            db.Inventory.update({ quantity: req.body.quantity }, invFilter)
              .then(data => res.json(data));
          } else {
            res.status(400).end();
          }
        });
    }
  };
};
