const router = require('express').Router();

module.exports = (db) => {
  // Load register page
  router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/profile');
    } else {
      res.render('register');
    }
  });

  // Load profile page
  router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
      db.User.findOne({
        where: {
          id: req.session.passport.user.id
        }
      }).then(() => {
        const user = {
          userInfo: req.session.passport.user,
          isloggedin: req.isAuthenticated()
        };
        // console.log(user);
        res.render('profile', user);
      });
    } else {
      res.redirect('/');
    }
  });

  // Load dashboard page
  router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      const user = {
        userInfo: req.session.passport.user,
        isloggedin: req.isAuthenticated()
      };
      res.render('character-list', user);
    } else {
      res.render('dashboard');
    }
  });

  // Load character list page
  router.get('/character-list', (req, res) => {
    if (req.isAuthenticated()) {
      const user = {
        userInfo: req.session.passport.user,
        isloggedin: req.isAuthenticated()
      };
      res.render('character-list', user);
    } else {
      res.redirect('/');
    }
  });

  // Load create/edit character page
  router.get('/create-edit-character', (req, res) => {
    if (req.isAuthenticated()) {
      const user = {
        userInfo: req.session.passport.user,
        isloggedin: req.isAuthenticated()
      };
      res.render('create-edit-character', user);
    } else {
      res.redirect('/');
    }
  });

  // Logout
  router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid', { path: '/' });
      res.redirect('/');
    });
  });

  // Render 404 page for any unmatched routes
  router.get('*', function (req, res) {
    res.render('404');
  });

  return router;
};
