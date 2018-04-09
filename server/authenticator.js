const db = require('./db');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('staff-local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    // console.log('authenticating');
    db.Staffs.get(email)
      .then((data) => {
        if (!data.rows[0]) {
          console.log('auth failed - no staff found');
          return done(null, false);
        }
        if (bcrypt.compareSync(password, data.rows[0].password)) { // if successful login
          console.log('auth success');
          return done(null, { email: email, role: 'staff' });
        }
        console.log('auth failed - probably password mismatch');
        return done(null, false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
));
passport.use('driver-local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    console.log('authenticating');
    db.Drivers.get(email)
      .then((data) => {
        if (!data.rows[0]) {
          console.log('auth failed - no staff found');
          return done(null, false);
        }
        if (bcrypt.compareSync(password, data.rows[0].password)) { // if successful login
          console.log('auth success');
          return done(null, { email: email, role: 'driver' });
        }
        console.log('auth failed - probably password mismatch');
        return done(null, false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
));
passport.use('passenger-local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    console.log('authenticating');
    db.Passengers.get(email)
      .then((data) => {
        if (!data.rows[0]) {
          console.log('auth failed - no staff found');
          return done(null, false);
        }
        if (bcrypt.compareSync(password, data.rows[0].password)) { // if successful login
          console.log('auth success');
          return done(null, { email: email, role: 'passenger' });
        }
        console.log('auth failed - probably password mismatch');
        return done(null, false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
));

passport.serializeUser(function(emailAndRole, done) {
  // console.log('seralizeUser');
  done(null, emailAndRole);
});
passport.deserializeUser(function(emailAndRole, done) {
  // console.log('deseralizeUser');
  let dbQuery;
  switch (emailAndRole.role) {
    case 'staff':
      dbQuery = db.Staffs.get(emailAndRole.email);
      break;
    case 'driver':
      dbQuery = db.Drivers.get(emailAndRole.email);
      break;
    case 'passenger':
      dbQuery = db.Passengers.get(emailAndRole.email);
      break;
  }
  dbQuery.then(data => {
    let user = data.rows[0];
    // add role to user object for authorization
    user.role = emailAndRole.role;
    done(null, user);
  })
  .catch(data => {
    done('deserializeUser failed', null);
  });
});

module.exports = (strategyName, redirectUrl) => {
  return passport.authenticate(strategyName, { failureRedirect: redirectUrl });
};