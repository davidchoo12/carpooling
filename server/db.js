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
    return pool.query('SELECT * FROM get_all_rides()');
  },
  get (id) {
    return pool.query('SELECT * FROM get_ride_by_id($1)', [id]);
  },
  add (start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate) {
    return pool.query('SELECT add_ride($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate]);
  },
  update (id, start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate) {
    return pool.query('SELECT update_ride($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, start_location, new Date(start_datetime), end_location, new Date(end_datetime), pax, starting_bid, bid_closing_time]);
  },
  // testU () {
  //   return pool.query('update ride set end_datetime = $1, starting_bid = $2 where id = 10', [new Date(), '$2']);
  // },
  delete (id) {
    return pool.query('SELECT delete_ride($1)', [id]);
  },
  search (start_location, end_location, start_date) {
    console.log(start_date);
    if (start_date == '')
      start_date = null;
    return pool.query('SELECT * FROM search_rides($1, $2, $3)', [start_location, end_location, start_date]);
  }
};

const Vehicles = {
  getAll () {
    return pool.query('SELECT * FROM get_all_vehicles()');
  },
  get (car_plate) {
    return pool.query('SELECT * FROM get_vehicle_by_car_plate($1)', [car_plate]);
  },
  add (car_plate, model, seat, driver_ic_num) {
    return pool.query('SELECT add_vehicle($1, $2, $3, $4)',
      [car_plate, model, seat, driver_ic_num]);
  },
  update (car_plate, model, seat) {
    return pool.query('SELECT update_vehicle($1, $2, $3)',
      [car_plate, model, seat]);
  },
  delete (car_plate) {
    return pool.query('SELECT delete_vehicle($1)', [car_plate]);
  },
};

const Bids = {
  getAll () {
    return pool.query('SELECT * FROM get_all_bids()');
  },
  get (passenger_user_email, ride_id) {
    return pool.query('SELECT * FROM get_bid_by_id($1, $2)', [passenger_user_email, ride_id]);
  },
  add (passenger_user_email, ride_id, amount) {
    return pool.query('SELECT add_bid($1, $2, $3)',
      [passenger_user_email, ride_id, amount]);
  },
  update (passenger_user_email, ride_id, amount) {
    return pool.query('SELECT update_bid_amount($1, $2, $3::money)',
      [passenger_user_email, ride_id, amount]);
  },
  delete (passenger_user_email, ride_id) {
    return pool.query('SELECT delete_bid($1, $2)', [passenger_user_email, ride_id]);
  },
  getRideSuccessfulBids (ride_id) {
    return pool.query('SELECT * FROM get_ride_successful_bids($1)', [ride_id]);
  }
};

module.exports = {
  Passengers: Passengers,
  Drivers: Drivers,
  Staffs: Staffs,
  Vehicles: Vehicles,
  Rides: Rides,
  Bids: Bids
};