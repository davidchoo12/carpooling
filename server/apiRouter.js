const db = require('./db');
const bcrypt = require('bcryptjs');
const apiRouter = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
apiRouter.get('/tests', (req, res) => {
  db.getTests()
    .then(data => {
      res.send(data.rows)
    });
});
apiRouter.post('/tests', (req, res) => {
  db.addTest(req.body.name)
    .then(data =>
      res.send('added ' + data.rowCount + ' row(s).')
    )
    .catch(err => {
      console.error(err.stack);
      res.status(500).send('error');
    });
});
apiRouter.get('/user', (req, res) => {
  db.getUsers()
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


module.exports = apiRouter;