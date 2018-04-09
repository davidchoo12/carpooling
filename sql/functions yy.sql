--GET ALL RIDES
CREATE OR REPLACE FUNCTION public.get_all_rides()
 RETURNS TABLE (
 id Integer,
 start_location varchar,
 start_datetime timestamp,
 end_location varchar,
 end_datetime timestamp,
 pax integer,
 starting_bid money, 
 bid_closing_time timestamp) AS
$func$

BEGIN
RETURN QUERY
SELECT R.id, R.start_location, R.start_datetime, R.end_location, R.end_datetime, R.pax, R.starting_bid, R.bid_closing_time
FROM ride R
WHERE is_deleted = 'f';
END
$func$
LANGUAGE plpgsql;


--GET RIDE BY ID
CREATE OR REPLACE FUNCTION public.get_ride_by_id(ride_id int)
 RETURNS TABLE (
 id Integer,
 start_location varchar,
 start_datetime timestamp,
 end_location varchar,
 end_datetime timestamp,
 pax integer,
 starting_bid money, 
 bid_closing_time timestamp) AS
$func$

BEGIN
RETURN QUERY
SELECT R.id, R.start_location, R.start_datetime, R.end_location, R.end_datetime, R.pax, R.starting_bid, R.bid_closing_time
FROM ride R
WHERE is_deleted = 'f'
AND "id" = ride_id;
END
$func$
LANGUAGE plpgsql;


--GET RIDE BY DRIVER IC NUMBER
CREATE OR REPLACE FUNCTION public.get_rides_by_driver_ic_num(ride_driver_ic_num char)
 RETURNS TABLE (
 id Integer,
 start_location varchar,
 start_datetime timestamp,
 end_location varchar,
 end_datetime timestamp,
 pax integer,
 starting_bid money, 
 bid_closing_time timestamp) AS
$func$

BEGIN
RETURN QUERY
SELECT R.id, R.start_location, R.start_datetime, R.end_location, R.end_datetime, R.pax, R.starting_bid, R.bid_closing_time
FROM ride R
WHERE is_deleted = 'f'
AND driver_ic_num = ride_driver_ic_num;
END
$func$
LANGUAGE plpgsql;

--GET RIDE BY VEHICLE CAR PLATE 
CREATE OR REPLACE FUNCTION public.get_rides_by_vehicle_car_plate(ride_vehicle_car_plate char)
 RETURNS TABLE (
 id Integer,
 start_location varchar,
 start_datetime timestamp,
 end_location varchar,
 end_datetime timestamp,
 pax integer,
 starting_bid money, 
 bid_closing_time timestamp) AS
$func$

BEGIN
RETURN QUERY
SELECT R.id, R.start_location, R.start_datetime, R.end_location, R.end_datetime, R.pax, R.starting_bid, R.bid_closing_time
FROM ride R
WHERE is_deleted = 'f'
AND vehicle_car_plate = ride_vehicle_car_plate;
END
$func$
LANGUAGE plpgsql;


-- GET ALL BIDS
CREATE OR REPLACE FUNCTION public.get_all_bids()
 RETURNS TABLE (
 passenger_user_email varchar,
 ride_id int,
 amount money,
 "time" timestamp) AS
$func$

BEGIN
RETURN QUERY
SELECT B.passenger_user_email, B.ride_id, B.amount, B.time
FROM bid B
WHERE is_deleted = 'f';
END
$func$
LANGUAGE plpgsql;

--GET BIDS BY ID
CREATE OR REPLACE FUNCTION public.get_bids_by_id(bid_passenger_user_email varchar, bid_ride_id int)
 RETURNS TABLE (
 passenger_user_email varchar,
 ride_id int,
 amount money,
 "time" timestamp) AS
$func$

BEGIN
RETURN QUERY
SELECT B.passenger_user_email, B.ride_id, B.amount, B.time
FROM bid B
WHERE is_deleted = 'f'
AND passenger_user_email = bid_passenger_user_email 
AND ride_id = bid_ride_id;
END
$func$
LANGUAGE plpgsql;

--GET VEHICLE BY DRIVER IC NUM
CREATE OR REPLACE FUNCTION public.get_vehicle_by_driver_ic_num(vehicle_driver_ic_num char)
 RETURNS TABLE (
 car_plate char,
 model varchar,
 seat int) AS
$func$

BEGIN
RETURN QUERY
SELECT V.car_plate, V.model, V.seat
FROM vehicle V
WHERE is_deleted = 'f'
AND driver_ic_num = vehicle_driver_ic_num;
END
$func$
LANGUAGE plpgsql;

SELECT * FROM get_vehicle_by_driver_ic_num('S1234567B');


--ADD VEHICLE
CREATE OR REPLACE FUNCTION public.add_vehicle(
vehicle_car_plate char,
vehicle_model varchar,
vehicle_seat int,
vehicle_driver_ic_num char
)
RETURNS BOOLEAN
AS $$
BEGIN
  INSERT INTO vehicle
    (car_plate, model, seat, is_deleted, driver_ic_num)
    VALUES
    (vehicle_car_plate, vehicle_model, vehicle_seat, false, vehicle_driver_ic_num);
  RETURN true;
END;
$$
LANGUAGE plpgsql;

--SEARCH RIDES
CREATE OR REPLACE FUNCTION public.search_rides(ride_start_location varchar, ride_start_datetime timestamp, ride_end_location varchar, ride_end_datetime timestamp, ride_pax int, ride_starting_bid money, ride_bid_closing_time timestamp)
 RETURNS TABLE (
 start_location varchar,
 start_datetime timestamp,
 end_location varchar,
 end_datetime timestamp,
 pax integer,
 starting_bid money, 
 bid_closing_time timestamp) AS
$func$

BEGIN
RETURN QUERY
SELECT R.start_location, R.start_datetime, R.end_location, R.end_datetime, R.pax, R.starting_bid, R.bid_closing_time
FROM ride R
WHERE is_deleted = 'f'
AND start_location = ride_start_location
AND start_datetime = ride_start_datetime
AND end_location = ride_end_location
AND end_datetime = ride_end_datetime;
END
$func$
LANGUAGE plpgsql;

--GET PASSENGER BY EMAIL
CREATE OR REPLACE FUNCTION public.get_passenger_by_email(passenger_email varchar)
 RETURNS TABLE (
 "name" varchar,
 contact char,
 "password" varchar) AS
$func$

BEGIN
RETURN QUERY
  SELECT U.email, U.name, U.contact, U.password
  FROM "user" U INNER JOIN passenger P ON P.user_email = U.email
  WHERE U.email = passenger_email
  AND NOT is_staff
  AND NOT is_deleted;
END;

--GET DRIVER BY EMAIL
CREATE OR REPLACE FUNCTION public.get_driver_by_email(driver_email varchar)
 RETURNS TABLE (
 email varchar,
 "name" varchar,
 ic_num char,
 contact char,
 "password" varchar) AS
$func$

BEGIN
RETURN QUERY
  SELECT U.email, U.name, D.ic_num, U.contact, U.password
  FROM "user" U INNER JOIN driver D ON D.user_email = U.email
  WHERE U.email = driver_email
  AND NOT is_staff
  AND NOT is_deleted;
END;
$func$
LANGUAGE plpgsql;


SELECT * FROM get.... (Method name)

SELECT add_vehicle('SGA1234A', 'BMW', '6', 'S1234567B');

SELECT delete_vehicle('SGA1234A');

SELECT update_vehicle('SGA1234A', 'Toyota', '5');

--For GETS
SELECT * FROM get_all_rides();
SELECT * FROM get_ride_by_id(1);
SELECT * FROM get_ride_successful_bids(1);
SELECT * FROM get_rides_by_vehicle_car_plate('SGA1234A');

SELECT add_bid('passenger@gmail.com', '1', 5.00::money);
SELECT add_bid('passengerr@gmail.com', '1', 6.00::money);
SELECT delete_bid('passenger@gmail.com', '1');

SELECT update_bid_amount('passengerr@gmail.com', '1', 7.00::money)

-- Example: SELECT add_ride('aa', timestamp '2018-07-05 03:04:00', 'bb', timestamp '2018-09-07 03:04:00', 3, 4.00::money, timestamp '2018-06-07 03:04:00', 'S1234567B', 'SAG3412G');

SELECT * FROM get_ride_successful_bids(1);

SELECT * FROM get_rides_by_driver_ic_num('S1234567B');

SELECT * FROM get_rides_by_vehicle_car_plate('SAG3412G');



SELECT add_bid('passengerr@gmail.com', '1', 5.00::money);
SELECT add_bid('passenger@gmail.com', '1', 6.00::money);
SELECT delete_bid('passenger@gmail.com', '1');

SELECT update_bid_amount('passengerr@gmail.com', '1', 7.00::money)

-- Example: SELECT add_ride('aa', timestamp '2018-07-05 03:04:00', 'bb', timestamp '2018-09-07 03:04:00', 3, 4.00::money, timestamp '2018-06-07 03:04:00', 'S1234567B', 'SAG3412G');

SELECT * FROM get_ride_successful_bids(1);

SELECT * FROM get_rides_by_driver_ic_num('S1234567B');

SELECT * FROM get_rides_by_vehicle_car_plate('SAG3412G');

SELECT add_ride('rr', timestamp '2018-07-05 03:04:00', 'gg', timestamp '2018-09-07 03:04:00', 3, 4.00::money, timestamp '2018-06-07 03:04:00', 'S1234567B', 'SAG3412G');

SELECT delete_ride('10');

SELECT update_ride('9', 'updated', timestamp '2018-08-05 03:04:00', 'updas', timestamp '2018-09-07 03:05:00', 4, 5.00::money, timestamp '2018-06-07 03:04:00');


SELECT * FROM get_all_bids();
SELECT * FROM get_bids_by_id('passenger@gmail.com','1');
SELECT * FROM get_bids_by_passenger_user_email('passenger@gmail.com');
SELECT * FROM get_bids_by_ride_id(1);
