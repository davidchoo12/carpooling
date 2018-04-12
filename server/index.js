const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'),
      PATH_DIST_DASHBOARD = path.join(__dirname, '../dist/dashboard'),
      staticDashboard = express.static(PATH_DIST_DASHBOARD),
      PATH_DIST_PUBLIC = path.join(__dirname, '../dist/public'),
      PORT = process.env.PORT || 3000,
      app = express()
      apiRouter = require('./apiRouter');
const db = require('./db');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authenticator = require('./authenticator');
const authorizer = require('./authorizer');
const roles = authorizer.roles;

// db.Rides.update().then(data => console.log(data)).catch(console.log);
// return;

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
  },
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json()); // for parsing application/json
app.use((req, res, next) => {
  console.log(req.method + ' ' + req.url);
  next();
});
app.use('/api', apiRouter);
// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('error :(');
// });

app.use('/admin', authorizer.allow([roles.staff]), express.static(PATH_DIST_DASHBOARD));
// app.use('/login/admin', express.static(path.join(__dirname, '../client/login/staff.html')));
// app.use('/login/driver', express.static(path.join(__dirname, '../client/login/driver.html')));
app.use('/login', express.static(path.join(__dirname, '../client/login'), { extensions: ['html'] }));
app.use('/register', express.static(path.join(__dirname, '../client/register'), { extensions: ['html'] }));
app.use('/particles.json', express.static(path.join(__dirname, '../client/public/views/particles.json')));
// app.use(history({
//   disableDotRule: true,
//   verbose: true
// }));
// app.use('/admin', express.static(PATH_DIST_DASHBOARD));
app.use('/', express.static(PATH_DIST_PUBLIC));

// app.get('/admin/*', (req, res) => {
//   res.sendFile(path.join(PATH_DIST_DASHBOARD, 'index.html'));
// });

app.listen(PORT);
console.log('Express server running on port ' + PORT);