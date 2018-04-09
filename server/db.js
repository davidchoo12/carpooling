const result = require('dotenv').config();
if(result.error && !process.env.DB_CONNECTIONSTRING) {
  throw result.error;
}
const connectionString = process.env.DB_CONNECTIONSTRING;
const { Pool, Client } = require('pg');

const pool = new Pool({
  connectionString: connectionString
});

const Users = {
  // login (email, hashedPassword) {
  //   return pool.query('SELECT login_user($1, $2)', [email, hashedPassword]);
  // },
  getAll () {
    return pool.query('SELECT * FROM PUBLIC.user');
  },
  get (email) {
    return pool.query('SELECT get_user($1)', [email]);
  },
  add (email, name, contact, password) {
    return pool.query('INSERT INTO PUBLIC.user(email, name, contact, password) VALUES($1, $2, $3, $4)',
      [email, name, contact, password]);
  },
  update (email, name, contact, password) {
    return pool.query(`
      UPDATE PUBLIC.user
      SET name = $2,
          contact = $3,
          password = $4
      WHERE email = $1`,
      [email, name, contact, password]);
  },
  delete (email) {
    return pool.query(`
      DELETE FROM PUBLIC.user
      WHERE email = $1`,
    [email]);
  }
};
const Staffs = {
  get (email) {
    console.log('staffs get ' + email);
    return pool.query('SELECT * FROM get_staff_by_email($1)', [email]);
  },
};
const Drivers = {
  get (email) {
    console.log('drivers get ' + email);
    return pool.query('SELECT * FROM get_driver_by_email($1)', [email]);
  },
};
const Passengers = {
  get (email) {
    console.log('passengers get ' + email);
    return pool.query('SELECT * FROM get_passenger_by_email($1)', [email]);
  },
};

const Rides = {
  getAll () {
    return pool.query('SELECT * FROM PUBLIC.ride');
  },
  get (id) {
    return pool.query('SELECT * FROM get_ride_by_id($1)', [id]);
  },
  add (start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate) {
    return pool.query('SELECT add_ride($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate]);
  },
  update (id, start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate) {
    return pool.query('SELECT update_ride($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate]);
  },
  delete (id) {
    return pool.query('SELECT delete_ride($1)', [id]);
  },
};

const Vehicles = {};

const Bids = {};

module.exports = {
  Passengers: Passengers,
  Drivers: Drivers,
  Staffs: Staffs,
  Vehicles: Vehicles,
  Rides: Rides,
  Bids: Bids
};