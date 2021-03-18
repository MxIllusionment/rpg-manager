const router = require('express').Router();
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

module.exports = (passport, db) => {
  const AuthController = require('../controllers/authController')(passport, db);
  const AppController = require('../controllers/appController')(db);
  const CharController = require('../controllers/charController')(db);
  const ItemController = require('../controllers/itemController')(db);
  const inventoryController = require('../controllers/inventoryController')(db);

  // Authentication
  router.post('/register', AuthController.register);
  router.post('/login', AuthController.login);
  router.get('/logout', AuthController.logout);
  router.put('/user/:id', ensureAuthenticated, AuthController.updateUser);
  router.delete('/user/:id', ensureAuthenticated, AuthController.deleteUser);
  router.post('/user/confirm', AuthController.confirmAuth);

  router.get('/examples', AppController.getExamples);
  router.post('/examples', AppController.createExample);
  router.delete('/examples/:id', AppController.deleteExample);

  // Character Routes
  router.get('/characters', CharController.getCharacters);
  router.get('/characters/:id', CharController.getOneCharacter);
  router.post('/characters', CharController.createCharacter);
  router.delete('/characters/:id', CharController.deleteCharacter);
  router.put('/characters/:id', CharController.updateCharacter);

  // Inventory Route
  router.get('/characters/:characterId/inventory', inventoryController.getInventory);
  router.post('/characters/:characterId/inventory', inventoryController.addInvItem);
  router.delete('/characters/:characterId/inventory/:itemId', inventoryController.deleteInvItem);
  router.put('/characters/:characterId/inventory/:itemId', inventoryController.updateQuantity);

  // Item Routes
  router.get('/items', ItemController.getItems);
  router.get('/items/:id', ItemController.getOneItem);
  router.post('/items', ItemController.createItem);
  router.delete('/items/:itemId', ItemController.deleteItem);
  router.put('/items/:itemId', ItemController.updateItem);

  return router;
};
