const result = require('dotenv').config();
// if(result.error) {
//   throw result.error;
// }
const connectionString = process.env.DB_CONNECTIONSTRING;
const { Pool, Client } = require('pg');
const express = require('express');
const app = express();

const pool = new Pool({
  connectionString: connectionString
});

function getTests() {
  return pool.query('SELECT * from test')
    .catch(err => console.error(e.stack));
}

app.get('/', (req, res) => {
  getTests()
    .then(data => {
      res.send(data.rows)
    });
});

app.listen(process.env.PORT || 3000);
