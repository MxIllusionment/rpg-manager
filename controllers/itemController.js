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
      db.Item.destroy({ where: { id: req.params.id } }).then(data => res.json(data));
    },

    // Update an item by id
    updateItem: (req, res) => {
      db.Item.update(req.body, { where: { id: req.params.id } }).then(data => res.json(data));
    }
  };
};
