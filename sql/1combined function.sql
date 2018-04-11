--update_passenger(email, contact, password)
----drop FUNCTION public.update_passenger(varchar, char, varchar);
CREATE OR REPLACE FUNCTION public.update_passenger(
    passenger_email varchar, 
    passenger_contact char,
    passenger_password varchar
)
  RETURNS boolean AS
$BODY$
BEGIN

    UPDATE  "user"
    SET contact = coalesce(passenger_contact, contact),
        "password" = coalesce(passenger_password, "password")
    WHERE email = passenger_email
	AND NOT is_deleted
	AND EXISTS (
		SELECT 1
		FROM passenger
		WHERE user_email = passenger_email
	);
	RETURN true;
END;
$BODY$   
LANGUAGE plpgsql;



--update_driver(email, contact, password)
----drop FUNCTION public.update_driver(varchar, char, varchar);
CREATE OR REPLACE FUNCTION public.update_driver(
  driver_email char,
  driver_contact char,
  driver_password varchar
)
  RETURNS boolean AS
$BODY$
BEGIN
    UPDATE  "user"
    SET contact = coalesce(driver_contact, contact),
        password = coalesce(driver_password, password)
    WHERE email = driver_email
	AND NOT is_deleted
	AND EXISTS (
		SELECT 1
		FROM driver
		WHERE user_email = driver_email
	);
	RETURN true;
END;
$BODY$   
LANGUAGE plpgsql;     



--delete_passenger(email)
CREATE OR REPLACE FUNCTION public.delete_passenger(passenger_email varchar)
  RETURNS boolean AS
$BODY$
DECLARE
	rowcount INTEGER;
BEGIN
	WITH row AS (
 		UPDATE "user"
  		SET is_deleted = true 
  		WHERE email = passenger_email
  			AND NOT is_deleted
  			AND EXISTS(
  				SELECT 1
  				FROM passenger
  				WHERE user_email = passenger_email
  			)
		RETURNING *
	)
	SELECT COUNT(*) INTO rowcount FROM row;
	RETURN rowcount > 0;
END;
$BODY$
  LANGUAGE plpgsql;


--delete_driver(email)
CREATE OR REPLACE FUNCTION public.delete_driver(driver_email varchar)
  RETURNS boolean AS
$BODY$
DECLARE
	rowcount INTEGER;
BEGIN
	WITH row AS (
 		UPDATE "user"
  		SET is_deleted = true 
  		WHERE email = driver_email
  			AND NOT is_deleted
  			AND EXISTS(
  				SELECT 1
  				FROM driver
  				WHERE user_email = driver_email
  			)
		RETURNING *
	)
	SELECT COUNT(*) INTO rowcount FROM row;
	RETURN rowcount > 0;
END;
$BODY$
LANGUAGE plpgsql;

--delete_vehicle(car_plate)
--drop FUNCTION public.delete_vehicle(char);
CREATE OR REPLACE FUNCTION public.delete_vehicle(driver_car_plate char)
  RETURNS boolean AS
$BODY$
DECLARE
	rowcount INTEGER;
BEGIN
	WITH row AS (
 		UPDATE vehicle
  		SET is_deleted = true 
  		WHERE car_plate = driver_car_plate
  			AND NOT is_deleted
		RETURNING *
	)
	SELECT COUNT(*) INTO rowcount FROM row;
	RETURN rowcount > 0;
END;
$BODY$
LANGUAGE plpgsql;

--login_user(email, password)
--drop FUNCTION public.login_user(varchar, varchar);
CREATE OR REPLACE FUNCTION public.login_user(
  user_email varchar, 
  user_password varchar
)
RETURNS boolean AS
$BODY$
BEGIN
  RETURN EXISTS (
  SELECT *
  FROM "user"
  WHERE email = user_email
    AND password = user_password
    AND NOT is_deleted
);
END;
$BODY$
LANGUAGE plpgsql;


--[Ride] 
--update_ride(id, start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time)
--drop FUNCTION public.update_ride(INTEGER, varchar, timestamp, varchar, timestamp, INTEGER, money, timestamp);
CREATE OR REPLACE FUNCTION public.update_ride(
  ride_id INTEGER, 
  ride_start_location varchar, 
  ride_start_datetime timestamp, 
  ride_end_location varchar, 
  ride_end_datetime timestamp, 
  ride_pax INTEGER, 
  ride_starting_bid money, 
  ride_bid_closing_time timestamp
)
RETURNS boolean AS
$BODY$
BEGIN

    UPDATE  ride
    SET 
      start_location = coalesce(ride_start_location, start_location),
      start_datetime = coalesce(ride_start_datetime, start_datetime),
      end_location = coalesce(ride_end_location, end_location),
      end_datetime = coalesce(ride_end_datetime, end_datetime),
      pax = coalesce(ride_pax, pax),
      starting_bid = coalesce(ride_starting_bid, starting_bid),
      bid_closing_time = coalesce(ride_bid_closing_time, bid_closing_time)
    
    WHERE id = ride_id
	AND NOT is_deleted
	AND EXISTS (
		SELECT 1
		FROM dirver
		WHERE ic_num = ride.driver_ic_num
	)
  AND EXISTS (
    SELECT 1
    FROM vehicle
    WHERE car_plate = vehicle_car_plate
  );
	RETURN true;
END;
$BODY$
LANGUAGE plpgsql;


--[Vehicle] update_vehicle(car_plate, model, seat)
--drop FUNCTION public.update_vehicle(char, varchar, INTEGER);
CREATE OR REPLACE FUNCTION public.update_vehicle(
  vehicle_car_plate char, 
  vehicle_model varchar, 
  vehicle_seat INTEGER
)
RETURNS boolean AS
$BODY$
BEGIN

    UPDATE  vehicle
    SET 
      model = coalesce(vehicle_model, model),
      seat = coalesce(vehicle_seat, seat)
         
    WHERE car_plate = vehicle_car_plate
	AND NOT is_deleted
	AND EXISTS (
		SELECT 1
		FROM dirver
		WHERE ic_num = vehicle.driver_ic_num
	);
	RETURN true;
END;
$BODY$
LANGUAGE plpgsql;


--[Ride] delete_ride(id)
--delete_ride(id)
--drop FUNCTION public.delete_ride(INTEGER);
CREATE OR REPLACE FUNCTION public.delete_ride(ride_id INTEGER)
  RETURNS boolean AS
$BODY$
DECLARE
	rowcount INTEGER;
BEGIN
	WITH row AS (
 		UPDATE ride
  		SET is_deleted = true 
  		WHERE id = ride_id
  			AND NOT is_deleted
  			AND EXISTS(
  				SELECT 1
  				FROM driver
		    	WHERE ic_num = ride.driver_ic_num
			)																												
        AND EXISTS (
          SELECT 1
          FROM vehicle
          WHERE car_plate = ride.vehicle_car_plate
        )
		RETURNING *
	)
	SELECT COUNT(*) INTO rowcount FROM row;
	RETURN rowcount > 0;
END;
$BODY$
  LANGUAGE plpgsql;


--SELECT login_user('driver5@gmail.com','driver password');



--add_bid(email, id, amount)
--drop FUNCTION public.add_bid(varchar, INTEGER, money);
CREATE OR REPLACE FUNCTION public.add_bid(
  bid_passenger_user_email varchar(254), 
  bid_ride_id INTEGER,  
  bid_amount money
)
RETURNS BOOLEAN AS $$ 

BEGIN

IF EXISTS (
  SELECT 1
  FROM bid
  WHERE passenger_user_email = bid_passenger_user_email
  AND ride_id = bid_ride_id
  AND is_deleted
)

THEN UPDATE bid
SET amount = bid_amount,
    time = CURRENT_TIMESTAMP,
    is_deleted = false
WHERE passenger_user_email = bid_passenger_user_email
AND ride_id = bid_ride_id;

return true;
END IF;

--IF bid_amount >= (SELECT MIN(amount) FROM  get_ride_successful_bids(bid_ride_id))
  IF bid_amount >= (SELECT starting_bid FROM get_ride_by_id(bid_ride_id))

THEN INSERT INTO bid
(passenger_user_email, ride_id, amount, time,  is_deleted)
VALUES
(bid_passenger_user_email,bid_ride_id, bid_amount, CURRENT_TIMESTAMP, false);

RETURN true;
END IF;

RETURN false;
END;
$$
LANGUAGE plpgsql;


--[Bid] update_bid_amount(passenger_user_email, ride_id, amount)
CREATE OR REPLACE FUNCTION update_bid_amount(bid_passenger_user_email varchar(254), bid_ride_id int4, bid_amount money)
  RETURNS BOOLEAN
AS $$
DECLARE
	rowcount INTEGER;
BEGIN
    WITH row AS (
		UPDATE  bid
    	SET time = CURRENT_TIMESTAMP, 
			amount = bid_amount
    	WHERE passenger_user_email = bid_passenger_user_email AND ride_id = bid_ride_id
		AND NOT is_deleted
		AND EXISTS (
			SELECT 1
			FROM passenger
			WHERE passenger_user_email = bid_passenger_user_email AND ride_id = bid_ride_id
		)
		RETURNING *
	)
	SELECT COUNT(*) INTO rowcount FROM row;
	RETURN rowcount > 0;
END;
$$
LANGUAGE plpgsql;


--delete_bid(email, id)
 CREATE OR REPLACE FUNCTION delete_bid(
     bid_passenger_user_email varchar(254), 
     bid_ride_id int4
     )
RETURNS BOOLEAN AS $$
DECLARE
	rowcount INTEGER;
BEGIN
    WITH row AS (
		UPDATE  bid
    	SET is_deleted = true
    	WHERE passenger_user_email = bid_passenger_user_email AND ride_id = bid_ride_id
		AND NOT is_deleted
		AND EXISTS (
			SELECT 1
			FROM passenger
			WHERE passenger_user_email = bid_passenger_user_email AND ride_id = bid_ride_id
		)
		RETURNING *
	)
	SELECT COUNT(*) INTO rowcount FROM row;
	RETURN rowcount > 0;
END;
$$
LANGUAGE plpgsql;



--[Ride] get_ride_successful_bids(id)
--drop FUNCTION public.get_ride_successful_bids(integer);
CREATE OR REPLACE FUNCTION get_ride_successful_bids(
	ride_bid_id Integer
)

RETURNS TABLE (
passenger_user_email varchar,
ride_id int, 
amount money,
"time" timestamp
) AS $func$
BEGIN 
RETURN QUERY

SELECT BID.passenger_user_email, BID.ride_id, BID.amount, BID.time FROM(
SELECT B.passenger_user_email, B.ride_id, B.amount, B.time, row_number() OVER(ORDER BY B.amount desc) AS rownum
FROM bid B
WHERE NOT B.is_deleted
AND B.ride_id = ride_bid_id
) as BID
JOIN ride ON (ride.id = BID.ride_id)
WHERE rownum <= ride.pax;

END;
$func$
LANGUAGE plpgsql;


--add_driver(icnum, email, name, contact, password)
--drop FUNCTION public.add_driver(char, varchar, varchar, int, varchar);
CREATE OR REPLACE FUNCTION public.add_driver(
  driver_ic_num char,
  driver_email varchar,
  driver_name varchar,
  driver_contact char,
  driver_password varchar
)
RETURNS BOOLEAN
AS $$
BEGIN
  INSERT INTO "user"
    (email, "name", contact, "password", is_staff, is_deleted)
    VALUES
    (driver_email, driver_name, driver_contact, driver_password, false, false);
  INSERT INTO driver
    (ic_num, user_email)
    VALUES
    (driver_ic_num, driver_email);
  RETURN true;
EXCEPTION
  WHEN unique_violation THEN
  RETURN false;
END;
$$
LANGUAGE plpgsql;
--SELECT add_driver('S1234567', 'driver@gmail.com', 'driver name', 81234567, 'driver password');


--add_passenger(icnum, email, name, contact, password)
--drop FUNCTION public.add_passenger(char, varchar, varchar, char, varchar);
CREATE OR REPLACE FUNCTION public.add_passenger(
  passenger_ic_num char,
  passenger_email varchar,
  passenger_name varchar,
  passenger_contact char,
  passenger_password varchar
)
RETURNS BOOLEAN
AS $$
BEGIN
  INSERT INTO "user"
    (email, "name", contact, "password", is_staff, is_deleted)
    VALUES
    (passenger_email, passenger_name, passenger_password, false, false);
  INSERT INTO passenger
    (user_email)
    VALUES
    (passenger_email);
  RETURN true;
END;
$$
LANGUAGE plpgsql;


--get_staff_by_email(email)
--drop FUNCTION public.get_staff_by_email(varchar);
CREATE OR REPLACE FUNCTION public.get_staff_by_email(
  staff_email varchar
)
RETURNS TABLE (
  email varchar,
  "name" varchar,
  contact char,
  "password" varchar
)
AS $$
BEGIN
RETURN QUERY
  SELECT U.email, U.name, U.contact, U.password
  FROM "user" U
  WHERE U.email = staff_email
  AND is_staff = true
  AND is_deleted = false;
END;
$$
LANGUAGE plpgsql;


--[Ride] add_ride(start_location, start_datetime, end_location, end_datetime, pax,starting_bid, bid_closing_time)
CREATE OR REPLACE FUNCTION add_ride(
  ride_start_location varchar,
  ride_start_datetime timestamp,
  ride_end_location varchar,
  ride_end_datetime timestamp,
  ride_pax int4,
  ride_starting_bid money,
  ride_bid_closing_time timestamp,
  ride_driver_ic_num char,
  ride_vehicle_car_plate char)
RETURNS BOOLEAN
AS $$
DECLARE
  vehicle_seat INTEGER;
BEGIN
SELECT seat INTO vehicle_seat FROM vehicle WHERE car_plate = ride_vehicle_car_plate;
IF(ride_pax > vehicle_seat) THEN
  RETURN false;
ELSE
	INSERT INTO ride
	(start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate, is_deleted)
	VALUES
	(ride_start_location, ride_start_datetime, ride_end_location, ride_end_datetime, ride_pax, ride_starting_bid, ride_bid_closing_time, ride_driver_ic_num, ride_vehicle_car_plate, false );
	RETURN true;
END IF;
END;
$$
LANGUAGE plpgsql;



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
 "email" varchar,
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
$func$
LANGUAGE plpgsql;


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

CREATE OR REPLACE FUNCTION public.get_all_vehicle()
  RETURNS TABLE (
    car_plate char,
	model varchar,
	seat int,
	driver_ic_num char) AS
$func$
BEGIN
RETURN QUERY
  SELECT V.car_plate, V.model, V.seat, V.driver_ic_num
  FROM vehicle V
  WHERE NOT is_deleted;
END;
$func$
LANGUAGE plpgsql;