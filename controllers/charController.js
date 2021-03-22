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
        description: req.body.description
      };

      // Checks that user is logged in and that all fields have content
      if (newChar.name.trim() === '' || newChar.game.trim() === '' ||
        newChar.description.trim() === '' || !req.session.passport) {
        res.status(400).end();
      } else {
        newChar.UserId = req.session.passport.user.id;
        db.Character.create(newChar)
          .then(data => res.json(data));
      }
    },

    // Delete a character by id
    deleteCharacter: (req, res) => {
      const filter = {
        where: {
          id: req.params.id
        }
      };

      // Checks if current user has permission to affect this character
      db.Character.findOne(filter)
        .then(data => {
          if (req.session.passport && req.session.passport.user.id === data.UserId) {
            db.Character.destroy({ where: { id: req.params.id } })
              .then(data => res.json(data));
          } else {
            res.status(400).end();
          }
        });
    },

    // Update a character by id
    updateCharacter: (req, res) => {
      const filter = {
        where: {
          id: req.params.id
        }
      };

      // Checks if current user has permission to affect this character
      db.Character.findOne(filter)
        .then(data => {
          if (req.session.passport && req.session.passport.user.id === data.UserId) {
            db.Character.update(req.body, { where: { id: req.params.id } })
              .then(data => res.json(data));
          } else {
            res.status(400).end();
          }
        });
    }
  };
};
