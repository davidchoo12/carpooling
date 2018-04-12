DROP FUNCTION public.add_driver(char, varchar, varchar, int, varchar);
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
SELECT add_driver('S1234567', 'driver@gmail.com', 'driver name', 81234567, 'driver password');

DROP FUNCTION public.add_passenger(char, varchar, varchar, char, varchar);
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

DROP FUNCTION public.get_staff_by_email(varchar);
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

CREATE OR REPLACE FUNCTION public.search_rides(ride_start_location varchar, ride_end_location varchar, ride_start_date date)
  RETURNS TABLE (
  id integer,
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
WHERE NOT R.is_deleted
AND R.start_location like '%' || ride_start_location || '%' -- || is concatenation operator
AND R.end_location like '%' || ride_end_location || '%'
AND (ride_start_date is null OR cast(R.start_datetime as date) = ride_start_date);
END
$func$
LANGUAGE plpgsql;