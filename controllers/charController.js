module.exports = function (db) {
  return {
    // Get all characters for current user
    getCharacters: (req, res) => {
      const filter = {
        where: {
          UserId: req.session.passport.user.id
        }
      };

      db.Character.findAll(filter)
        .then(data => res.json(data));
    },

    // Get one characters by id
    getOneCharacter: (req, res) => {
      const filter = {
        where: {
          id: req.params.id
        }
      };

      db.Character.findOne(filter)
        .then(data => res.json(data));
    },

    // Create a new character
    createCharacter: (req, res) => {
      const newChar = {
        name: req.body.name,
        game: req.body.game,
        description: req.body.description,
        UserId: req.session.passport.user.id
      };

      db.Character.create(newChar)
        .then(data => res.json(data));
    },

    // Delete a character by id
    deleteCharacter: (req, res) => {
      db.Character.destroy({ where: { id: req.params.id } }).then(data => res.json(data));
    },

    // Update a character by id
    updateCharacter: (req, res) => {
      db.Character.update(req.body, { where: { id: req.params.id } }).then(data => res.json(data));
    }
  };
};
