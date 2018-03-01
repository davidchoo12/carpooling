const result = require('dotenv').config();
if(result.error && !process.env.DB_CONNECTIONSTRING) {
  throw result.error;
}
const connectionString = process.env.DB_CONNECTIONSTRING;
const { Pool, Client } = require('pg');

const pool = new Pool({
  connectionString: connectionString
});

module.exports = {
  getTests () {
    return pool.query('SELECT * from test')
      .catch(err => console.error(err.stack));
  },
  addTest (name) {
    return pool.query('INSERT INTO test(name) VALUES($1)', [name]);
  },
  getUsers () {
    return pool.query('SELECT * FROM PUBLIC.user');
  },
  getUser (email) {
    return pool.query('SELECT * FROM PUBLIC.user WHERE email = $1 LIMIT 1', [email]);
  },
  addUser (email, name, contact, password) {
    return pool.query('INSERT INTO PUBLIC.user(email, name, contact, password) VALUES($1, $2, $3, $4)',
      [email, name, contact, password]);
  },
  updateUser (email, name, contact, password) {
    return pool.query(`
      UPDATE PUBLIC.user
      SET name = $2,
          contact = $3,
          password = $4
      WHERE email = $1`,
      [email, name, contact, password]);
  },
  deleteUser (email) {
    return pool.query(`
      DELETE FROM PUBLIC.user
      WHERE email = $1`,
    [email]);
  }
};