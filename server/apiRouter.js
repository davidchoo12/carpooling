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
      let result = data.rows;
      result.forEach(e => {
        e.start_datetime = e.start_datetime.toISOString().replace('.000Z', '');
        e.end_datetime = e.end_datetime.toISOString().replace('.000Z', '');
        e.bid_closing_time = e.bid_closing_time.toISOString().replace('.000Z', '');
      });
      res.send(result);
    })
    .catch(errorHandler(res));
});
apiRouter.get('/ride/:id', (req, res) => {
  db.Rides.get(req.params.id)
    .then(data => {
      let result = data.rows[0];
      result.start_datetime = result.start_datetime.toISOString().replace('.000Z', '');
      result.end_datetime = result.end_datetime.toISOString().replace('.000Z', '');
      result.bid_closing_time = result.bid_closing_time.toISOString().replace('.000Z', '');
      res.send(result);
    })
    .catch(errorHandler(res));
});
apiRouter.post('/ride', (req, res) => {
  const { start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate } = req.body;
  db.Rides.add(start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate)
    .then(data => {
      console.log('add ride', data);
    })
    .catch(err => {
      errorHandler(res);
    });
});

function errorHandler(res) {
  return (err) => {
    console.error(err.stack);
    res.status(500).send('error');
  };
}

module.exports = apiRouter;