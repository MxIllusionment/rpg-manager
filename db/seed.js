module.exports = (db) => {
  db.User.create({
    firstName: 'Master',
    lastName: 'Gamer',
    email: 'master@gamer.com',
    password: process.env.ADMIN_USER_PWD,
    isAdmin: true
  })
    .then(() => {
      return db.User.create({
        firstName: 'Example',
        lastName: 'Player',
        email: 'example@gamer.com',
        password: process.env.USER_PWD,
        isAdmin: false
      });
    })
    .then(() => {
      return db.Character.create({
        name: 'Example Character',
        game: 'Example Game',
        description: 'This contains the example character\'s data',
        UserId: 2
      });
    })
    .then(() => {
      return db.Item.create({
        name: 'Example Item #1',
        description: 'This is an example description',
        UserId: 2
      });
    })
    .then(() => {
      return db.Item.create({
        name: 'Example Item #2',
        description: 'This is an example description',
        UserId: 2
      });
    })
    .then(() => {
      db.Character.findOne({ where: { id: 1 } })
        .then(char => char.addItem(1, { through: { quantity: 3 } }));
      db.Character.findOne({ where: { id: 1 } })
        .then(char => char.addItem(2, { through: { quantity: 1 } }));
    });
};
