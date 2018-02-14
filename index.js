const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
})

pool.query('SELECT * from test', (err, res) => {
  console.log(err, res)
  pool.end()
})