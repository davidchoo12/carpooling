const db = require('./db');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authenticator = require('./authenticator');
const authorizer = require('./authorizer');
const roles = authorizer.roles;
const apiRouter = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

apiRouter.use(require('cookie-parser')());
apiRouter.use(require('body-parser').urlencoded({ extended: true }));
apiRouter.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
apiRouter.use(passport.initialize());
apiRouter.use(passport.session());

apiRouter.post('/admin/login',
  authenticator('staff-local', '/login/admin'),
  (req, res) => {
    res.redirect('/admin');
});
apiRouter.get('/user', (req, res) => {
  db.Users.getUsers()
    .then(data => {
      res.send(data.rows)
    })
    .catch(err => {
      console.error(err.stack);
      res.status(500).send('error');
    });
});
apiRouter.post('/user', (req, res) => {
  const { email, name, contact, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.addUser(email, name, contact, hashedPassword)
    .then(data =>
      res.send('added ' + data.rowCount + ' row(s).')
    )
    .catch(err => {
      console.error(err.stack);
      res.status(500).send('error');
    });
});
apiRouter.get('/user/:email', (req, res) => {
  db.getUser(req.params.email)
    .then(data => {
      res.send(data.rows[0])
    })
    .catch(err => {
      console.error(err.stack);
      res.status(500).send('error');
    });
});
apiRouter.put('/user', (req, res) => {
  const { email, name, contact, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.updateUser(email, name, contact, hashedPassword)
    .then(data => {
      res.send('updated ' + data.rowCount + ' row(s).')
    })
    .catch(err => {
      console.error(err.stack);
      res.status(500).send('error');
    });
});
apiRouter.delete('/user', (req, res) => {
  db.deleteUser(req.body.email)
    .then(data => {
      res.send('deleted ' + data.rowCount + ' row(s).')
    })
    .catch(err => {
      console.error(err.stack);
      res.status(500).send('error');
    });
});

apiRouter.get('/ride', authorizer.allow([roles.staff]), (req, res) => {
  db.Rides.getAll()
    .then(data => {
      res.send(data.rows)
    })
    .catch(errorHandler(res));
});
apiRouter.get('/ride/:id', (req, res) => {
  db.Rides.get(req.params.id)
    .then(data => {
      res.send(data.rows)
    })
    .catch(errorHandler(res));
});

function errorHandler(res) {
  return (err) => {
    console.error(err.stack);
    res.status(500).send('error');
  };
}

module.exports = apiRouter;