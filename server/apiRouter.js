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
apiRouter.use(require('express-session')({ secret: 'keyboard cat' }));
apiRouter.use(passport.initialize());
apiRouter.use(passport.session());

apiRouter.post('/admin/login',
  authenticator('staff-local', '/admin', '/login/admin'),
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
apiRouter.post('/ride', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  const { start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate } = req.body;
  db.Rides.add(start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate)
    .then(data => {
      console.log('add ride', data);
      res.send('added ride.');
    })
    .catch(err => {
      errorHandler(res);
    });
});
apiRouter.put('/ride', (req, res) => {
  if (req.user.role == roles.staff) {
    updateRide();
  } else {
    const getRide = db.Rides.get(req.body.id)
    const getDriver = db.Drivers.get(req.user.email)
    Promise.all([getRide, getDriver])
    .then(values => {
      const ride = values[0].rows[0];
      const driver = values[1].rows[0];
      if (ride.driver_ic_num == driver.ic_num) {
        updateRide();
      } else {
        res.status(403);
      }
    })
    .catch(err => {
      errorHandler(res);
    });
  }
  function updateRide() {
    console.log('updating ride');
    const { id, start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate } = req.body;
    db.Rides.update(id, start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate)
      .then(data => {
        console.log('update ride', data);
        res.send('updated ride');
      })
      .catch(err => {
        errorHandler(res);
      });
  }
});
apiRouter.delete('/ride', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  db.Rides.delete(req.body.id)
    .then(data => {
      console.log('delete ride', data);
      res.send('deleted ride');
    })
    .catch(err => {
      errorHandler(res);
    });
});

apiRouter.get('/vehicle', authorizer.allow([roles.staff]), (req, res) => {
  db.Vehicles.getAll()
    .then(data => {
      res.send(data.rows);
    })
    .catch(errorHandler(res));
});
apiRouter.get('/vehicle/:car_plate', authorizer.allow([roles.staff]), (req, res) => {
  db.Vehicles.get(req.params.car_plate)
    .then(data => {
      res.send(data.rows[0]);
    })
    .catch(errorHandler(res));
});
apiRouter.post('/vehicle', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  const { car_plate, model, seat, driver_ic_num } = req.body;
  db.Vehicles.add(car_plate, model, seat, driver_ic_num)
    .then(data => {
      console.log('add vehicle', data);
      res.send('added vehicle');
    })
    .catch(err => {
      errorHandler(res);
    });
});
apiRouter.put('/vehicle', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  const { car_plate, model, seat } = req.body;
  db.Vehicles.update(car_plate, model, seat)
    .then(data => {
      console.log('update vehicle', data);
      res.send('updated vehicle');
    })
    .catch(err => {
      errorHandler(res);
    });
});
apiRouter.delete('/vehicle', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  db.Vehicles.delete(req.body.car_plate)
    .then(data => {
      console.log('delete vehicle', data);
      res.send('deleted vehicle');
    })
    .catch(err => {
      errorHandler(res);
    });
});

apiRouter.get('/bid', authorizer.allow([roles.staff]), (req, res) => {
  console.log(req.user);
  db.Bids.getAll()
    .then(data => {
      data.rows.forEach(e => e.time = e.time.toISOString().replace('.000Z', ''));
      res.send(data.rows);
    })
    .catch(errorHandler(res));
});
apiRouter.get('/bid/:passenger_user_email/:ride_id', (req, res, next) => {
  // check if user is bid owner
  // todo, access control for driver?
  if (req.user.role == 'staff' || req.params.passenger_user_email == req.user.email) {
    db.Bids.get(req.params.passenger_user_email, req.params.ride_id)
      .then(data => {
        data.rows[0].time = data.rows[0].time.toISOString().replace('.000Z', '');
        res.send(data.rows[0]);
      })
      .catch(errorHandler(res));
  } else {
    res.status(403); // forbidden
  }
});
apiRouter.post('/bid', authorizer.allow([roles.staff, roles.passenger]), (req, res) => {
  const { passenger_user_email, ride_id, amount } = req.body;
  db.Bids.add(passenger_user_email, ride_id, amount)
    .then(data => {
      console.log('add bid', data);
      res.send('added bid');
    })
    .catch(err => {
      errorHandler(res);
    });
});
apiRouter.put('/bid', (req, res) => {
  const { passenger_user_email, ride_id, amount } = req.body;
  // check if user is bid owner
  if (req.user.role == 'staff' || req.user.email == passenger_user_email) {
    db.Bids.update(passenger_user_email, ride_id, amount)
      .then(data => {
        console.log('update bid', data);
        res.send('updated bid');
      })
      .catch(err => {
        errorHandler(res);
      });
  } else {
    res.status(403);
  }
});
apiRouter.delete('/bid', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  // check if user is bid owner
  if (req.user.role == 'staff' || req.user.email == req.passenger_user_email) {
    db.Bids.delete(req.body.passenger_user_email, req.body.ride_id)
      .then(data => {
        console.log('delete bid', data);
        res.send('deleted bid');
      })
      .catch(err => {
        errorHandler(res);
      });
  } else {
    res.status(403);
  }
});

function errorHandler(res) {
  return (err) => {
    console.error(err.stack);
    res.status(500).send('error');
  };
}

module.exports = apiRouter;