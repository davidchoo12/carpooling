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
apiRouter.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
apiRouter.use(passport.initialize());
apiRouter.use(passport.session());

// for vue to get user email and role
apiRouter.get('/user', (req, res) => {
  console.log('req.user', req.user);
  if (req.user) {
    const { email, name, contact, role } = req.user;
    if (req.user.role == 'driver') {
      res.send({
        email: email,
        ic_num: req.user.ic_num,
        name: name,
        contact: contact,
        role: role
      });
    } else {
      res.send({
        email: email,
        name: name,
        contact: contact,
        role: role
      });
    }
  } else {
    res.send(null);
  }
});
apiRouter.post('/admin/login',
  authenticator('staff-local', '/admin', '/login/admin')
);
apiRouter.post('/login/passenger',
  authenticator('passenger-local', '/', '/login')
);
apiRouter.post('/login/driver',
  authenticator('driver-local', '/', '/login/driver')
);
apiRouter.post('/register/passenger', (req, res, next) => {
  const { email, name, contact, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.Passengers.add(email, name, contact, hashedPassword)
    .then(data => {
      next();
    })
    .catch(errorHandler(res));
}, authenticator('passenger-local', '/', '/login'));
apiRouter.post('/register/driver', (req, res, next) => {
  const { ic_num, email, name, contact, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.Drivers.add(ic_num, email, name, contact, hashedPassword)
    .then(data => {
      next();
    })
    .catch(errorHandler(res));
}, authenticator('driver-local', '/', '/login/driver'));
apiRouter.get('/user/:email', (req, res) => {
  db.getUser(req.params.email)
    .then(data => {
      res.send(data.rows[0]);
    })
    .catch(errorHandler(res));
});
apiRouter.put('/user', (req, res) => {
  const { email, name, contact, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.updateUser(email, name, contact, hashedPassword)
    .then(data => {
      res.send('updated ' + data.rowCount + ' row(s).')
    })
    .catch(errorHandler(res));
});
apiRouter.delete('/user', (req, res) => {
  db.deleteUser(req.body.email)
    .then(data => {
      res.send('deleted ' + data.rowCount + ' row(s).')
    })
    .catch(errorHandler(res));
});
apiRouter.get('/ride', (req, res) => {
  if (req.user && req.user.role && req.user.role == roles.driver) {
    db.Rides.getDriverRides(req.user.ic_num)
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
  } else {
    db.Rides.getAll()
    .then(data => {
      let result = data.rows;
      let successBidsQueries = [];
      result.forEach(e => {
        successBidsQueries.push(db.Bids.getRideSuccessfulBids(e.id));
        e.start_datetime = e.start_datetime.toISOString().replace('.000Z', '');
        e.end_datetime = e.end_datetime.toISOString().replace('.000Z', '');
        e.bid_closing_time = e.bid_closing_time.toISOString().replace('.000Z', '');
      });
      Promise.all(successBidsQueries)
      .then(values => {
        values.forEach(b => {
          const bidCount = b.rowCount;
          if (bidCount > 0) {
            const resultRideIndex = result.findIndex(e => e.id == b.rows[0].ride_id);
            if (bidCount == result[resultRideIndex].pax) {// if fully booked, use minimum bid in successBidsQueries, increment amount (which is a $x.xx string)
              const minBidAmt = Math.min(...b.rows.map(e => parseFloat(e.amount.substr(1))));
              result[resultRideIndex].min_success_bid = '$' + minBidAmt.toFixed(2);
            }
          }
        });
        res.send(result);
      });
    })
    .catch(errorHandler(res));
  }
});
apiRouter.post('/ride/search', (req, res) => {
  const { startLocation, endLocation, startDate } = req.body;
  db.Rides.search(startLocation, endLocation, startDate)
    .then(data => {
      let result = data.rows;
      let successBidsQueries = [];
      result.forEach(e => {
        successBidsQueries.push(db.Bids.getRideSuccessfulBids(e.id));
        e.start_datetime = e.start_datetime.toISOString().replace('.000Z', '');
        e.end_datetime = e.end_datetime.toISOString().replace('.000Z', '');
        e.bid_closing_time = e.bid_closing_time.toISOString().replace('.000Z', '');
      });
      Promise.all(successBidsQueries)
      .then(values => {
        values.forEach(b => {
          const bidCount = b.rowCount;
          if (bidCount > 0) {
            const resultRideIndex = result.findIndex(e => e.id == b.rows[0].ride_id);
            if (bidCount == result[resultRideIndex].pax) {// if fully booked, use minimum bid in successBidsQueries, increment amount (which is a $x.xx string)
              const minBidAmt = Math.min(...b.rows.map(e => parseFloat(e.amount.substr(1))));
              result[resultRideIndex].min_success_bid = '$' + minBidAmt.toFixed(2);
            }
          }
        });
        res.send(result);
      });
    })
    .catch(errorHandler(res));
});
apiRouter.get('/ride/:id', (req, res) => {
  db.Rides.get(req.params.id)
    .then(data => {
      let result = data.rows;
      let successBidsQueries = [];
      result.forEach(e => {
        successBidsQueries.push(db.Bids.getRideSuccessfulBids(e.id));
        e.start_datetime = e.start_datetime.toISOString().replace('.000Z', '');
        e.end_datetime = e.end_datetime.toISOString().replace('.000Z', '');
        e.bid_closing_time = e.bid_closing_time.toISOString().replace('.000Z', '');
      });
      Promise.all(successBidsQueries)
      .then(values => {
        values.forEach(b => {
          const bidCount = b.rowCount;
          if (bidCount > 0) {
            const resultRideIndex = result.findIndex(e => e.id == b.rows[0].ride_id);
            if (bidCount == result[resultRideIndex].pax) {// if fully booked, use minimum bid in successBidsQueries, increment amount (which is a $x.xx string)
              const minBidAmt = Math.min(...b.rows.map(e => parseFloat(e.amount.substr(1))));
              result[resultRideIndex].min_success_bid = '$' + minBidAmt.toFixed(2);
            }
          }
        });
        res.send(result[0]);
      });
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
    .catch(errorHandler(res));
});
apiRouter.put('/ride', (req, res) => {
  if (req.user.role == roles.staff) {
    updateRide();
  } else {
    // check whether user owns ride
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
    .catch(errorHandler(res));
  }
  function updateRide() {
    console.log('updating ride');
    const { id, start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate } = req.body;
    db.Rides.update(id, start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate)
      .then(data => {
        console.log('update ride', data);
        res.send('updated ride');
      })
      .catch(errorHandler(res));
  }
});
apiRouter.delete('/ride', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  if (req.user.role == roles.staff) {
    deleteRide();
  } else {
    // check whether user owns ride
    const getRide = db.Rides.get(req.body.id)
    const getDriver = db.Drivers.get(req.user.email)
    Promise.all([getRide, getDriver])
    .then(values => {
      const ride = values[0].rows[0];
      const driver = values[1].rows[0];
      if (ride.driver_ic_num == driver.ic_num) {
        deleteRide();
      } else {
        res.status(403);
      }
    })
    .catch(errorHandler(res));
  }
  function deleteRide() {
    db.Rides.delete(req.body.id)
      .then(data => {
        console.log('delete ride', data);
        res.send('deleted ride');
      })
      .catch(errorHandler(res));
  }
});

apiRouter.get('/vehicle', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  if (req.user.role == 'staff') {
    db.Vehicles.getAll()
      .then(data => {
        res.send(data.rows);
      })
      .catch(errorHandler(res));
  } else if (req.user.role == 'driver') {
    db.Vehicles.getDriverVehicles(req.user.ic_num)
      .then(data => {
        res.send(data.rows);
      })
      .catch(errorHandler(res));
  } else {
    res.status(403).send('must be a driver');
  }
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
    .catch(errorHandler(res));
});
apiRouter.put('/vehicle', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  if (req.user.role == roles.staff) {
    updateVehicle();
  } else {
    // check whether user owns vehicle
    const getVehicle = db.Vehicles.get(req.body.car_plate)
    const getDriver = db.Drivers.get(req.user.email)
    Promise.all([getVehicle, getDriver])
    .then(values => {
      const vehicle = values[0].rows[0];
      const driver = values[1].rows[0];
      if (vehicle.driver_ic_num == driver.ic_num) {
        updateVehicle();
      } else {
        res.status(403);
      }
    })
    .catch(errorHandler(res));
  }
  function updateVehicle() {
    const { car_plate, model, seat } = req.body;
    db.Vehicles.update(car_plate, model, seat)
      .then(data => {
        console.log('update vehicle', data);
        res.send('updated vehicle');
      })
      .catch(errorHandler(res));
  }
});
apiRouter.delete('/vehicle', authorizer.allow([roles.staff, roles.driver]), (req, res) => {
  if (req.user.role == roles.staff) {
    deleteVehicle();
  } else {
    // check whether user owns vehicle
    const getVehicle = db.Vehicles.get(req.body.car_plate)
    const getDriver = db.Drivers.get(req.user.email)
    Promise.all([getVehicle, getDriver])
    .then(values => {
      const vehicle = values[0].rows[0];
      const driver = values[1].rows[0];
      if (vehicle.driver_ic_num == driver.ic_num) {
        deleteVehicle();
      } else {
        res.status(403);
      }
    })
    .catch(errorHandler(res));
  }
  function deleteVehicle() {
    db.Vehicles.delete(req.body.car_plate)
      .then(data => {
        console.log('delete vehicle', data);
        res.send('deleted vehicle');
      })
      .catch(errorHandler(res));
  }
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
apiRouter.get('/bid/:passenger_user_email', (req, res) => {
  if (!req.user) res.status(401).send('you cannot view bids without logging in');
  if (req.user.role == 'staff' || req.params.passenger_user_email == req.user.email) {
    db.Bids.getPassengerBids(req.params.passenger_user_email)
    .then(data => {
      if (data.rows.length > 0) {
        let result = data.rows;
        let rideQueries = [];
        result.forEach(e => {
          rideQueries.push(db.Rides.get(e.ride_id));
          // e.time = e.time.toISOString().replace('.000Z', '');
        });
        console.log('size', rideQueries.length);
        Promise.all(rideQueries)
        .then(values => {
          values.forEach(rideData => {
            let r = rideData.rows[0];
            console.log(r);
            r.start_datetime = r.start_datetime.toISOString().replace('.000Z', '');
            r.end_datetime = r.end_datetime.toISOString().replace('.000Z', '');
            r.bid_closing_time = r.bid_closing_time.toISOString().replace('.000Z', '');
            const resultBidIndex = result.findIndex(e => e.ride_id == rideData.rows[0].id);
            result[resultBidIndex].ride = r;
          });
          res.send(result);
        });
      }
    })
    .catch(errorHandler(res));
  }
});
apiRouter.get('/bid/:passenger_user_email/:ride_id', authorizer.allow([roles.staff, roles.passenger]), (req, res, next) => {
  // check if user is bid owner
  // todo, access control for driver?
  if (req.user.role == 'staff' || req.params.passenger_user_email == req.user.email) {
    db.Bids.get(req.params.passenger_user_email, req.params.ride_id)
      .then(data => {
        if (data.rows[0]) {
          data.rows[0].time = data.rows[0].time.toISOString().replace('.000Z', '');
          res.send(data.rows[0]);
        }
        res.send({});
      })
      .catch(errorHandler(res));
  } else {
    res.status(403); // forbidden
  }
});
apiRouter.post('/bid', authorizer.allow([roles.staff, roles.passenger]), (req, res) => {
  const ride_id = req.body.ride_id;
  let amount = req.body.amount;
  let passenger_user_email = req.user.email;
  if (req.body.passenger_user_email) {
    passenger_user_email = req.body.passenger_user_email;
  }
  if (amount.toString().indexOf('$') < 0) {
    amount = '$' + amount;
  }
  db.Bids.add(passenger_user_email, ride_id, amount)
    .then(data => {
      if (!data.rows[0].add_bid) {
        res.status(400).send('bid amount insufficient'); // bad request
      }
      console.log('success adding bid');
      res.send('added bid');
    })
    .catch(errorHandler(res));
});
apiRouter.put('/bid', authorizer.allow([roles.staff, roles.passenger]), (req, res) => {
  console.log('update bid');
  const ride_id = req.body.ride_id;
  let amount = req.body.amount;
  let passenger_user_email = req.user.email;
  if (req.body.passenger_user_email) {
    passenger_user_email = req.body.passenger_user_email;
  }
  if (amount.toString().indexOf('$') < 0) {
    amount = '$' + amount;
  }
  // check if user is bid owner
  if (req.user.role == 'staff' || req.user.email == passenger_user_email) {
    db.Bids.update(passenger_user_email, ride_id, amount)
      .then(data => {
        res.send('updated bid');
      })
      .catch(errorHandler(res));
  } else {
    res.status(403);
  }
});
apiRouter.delete('/bid', authorizer.allow([roles.staff, roles.passenger]), (req, res) => {
  const ride_id = req.body.ride_id;
  let passenger_user_email = req.user.email;
  if (req.body.passenger_user_email) {
    passenger_user_email = req.body.passenger_user_email;
  }
  // check if user is bid owner
  if (req.user.role == 'staff' || req.user.email == passenger_user_email) {
    console.log('delete bid', passenger_user_email, req.body.ride_id);
    db.Bids.delete(passenger_user_email, req.body.ride_id)
      .then(data => {
        console.log('delete bid', data);
        res.send('deleted bid');
      })
      .catch(errorHandler(res));
  } else {
    res.status(403);
  }
});

apiRouter.get('/logout', function(req, res) {
  console.log('logout');
  req.logout();
  res.redirect('/');
});

function errorHandler(res) {
  return (err) => {
    console.log(err);
    let message;
    if (err.constraint) { // error due to constraint violation
      message = (function (constraint) {
        switch (constraint) {
          case 'valid_contact':
            return 'invalid contact';
          case 'valid_ic_num':
            return 'invalid ic number';
        }
      })(err.constraint);
      if (err.constraint.indexOf('pkey') > 0) {
        message = 'duplicate key'
      }
    }
    res.status(500).send(message ? message : err.error);
  };
}

module.exports = apiRouter;