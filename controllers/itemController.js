module.exports = function (db) {
  return {
    // Get all items
    getItems: (req, res) => {
      db.Item.findAll()
        .then(data => res.json(data));
    },

    // Get one item by id
    getOneItem: (req, res) => {
      const filter = {
        where: {
          id: req.params.id
        }
      };

      db.Item.findOne(filter)
        .then(data => res.json(data));
    },

    // Create a new item
    createItem: (req, res) => {
      const newItem = {
        name: req.body.name,
        description: req.body.description
      };

      // Checks that user is logged in and that both name and description have content
      if (newItem.name.trim() === '' || newItem.description.trim() === '' || !req.session.passport) {
        res.status(400).end();
      } else {
        newItem.UserId = req.session.passport.user.id;
        db.Item.create(newItem)
          .then(data => res.json(data));
      }
    },

    // Delete an item by id
    deleteItem: (req, res) => {
      const filter = {
        where: {
          id: req.params.id
        }
      };

      // Checks if current user has permission to affect this item
      db.Item.findOne(filter)
        .then(data => {
          if (req.session.passport && req.session.passport.user.id === data.UserId) {
            db.Item.destroy({ where: { id: req.params.id } })
              .then(data => res.json(data));
          } else {
            res.status(400).end();
          }
        });
    },

    // Update an item by id
    updateItem: (req, res) => {
      const filter = {
        where: {
          id: req.params.id
        }
      };

      // Checks if current user has permission to affect this item
      db.Item.findOne(filter)
        .then(data => {
          if (req.session.passport && req.session.passport.user.id === data.UserId) {
            db.Item.update(req.body, { where: { id: req.params.id } })
              .then(data => res.json(data));
          } else {
            res.status(400).end();
          }
        });
    }
  };
};
