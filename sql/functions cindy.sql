CREATE OR REPLACE FUNCTION create_staff(staff_email varchar(100), staff_name varchar(100), staff_password varchar(100), staff_contact int)
returns boolean as $$
begin
  insert into public.user(email, name, password, contact, is_staff) values (staff_email, staff_name, staff_password, staff_contact, true);
  return true;
exception
  when unique_violation then
    return false;
end; $$
language plpgsql;




CREATE OR REPLACE FUNCTION create_driver(driver_email varchar(100), driver_name varchar(100), driver_password varchar(100), driver_contact int, driver_ic_num varchar(100), driver_licence varchar(100))
returns boolean as $$
begin
  insert into public.user(email, name, password, contact) values (driver_email, driver_name, driver_password, driver_contact);
  insert into public.driver(email,ic_num, licence) values (driver_email,driver_ic_num, driver_licence);
  return true;
exception
  when unique_violation then
    return false;
end; $$
language plpgsql;



CREATE OR REPLACE FUNCTION create_passenger(passenger_email varchar(100), passenger_name varchar(100), passenger_password varchar(100), passenger_contact int)
returns boolean as $$
begin
  insert into public.user(email, name, password, contact) values (passenger_email, passenger_name, passenger_password, passenger_contact);
  insert into public.passenger(email) values (passenger_email);
  return true;
exception
  when unique_violation then
    return false;
end; $$
language plpgsql;

select create_passenger('d@bcde.com', 'lll', 'asdf', 123)


>>>>>>>>>>>>>>>>>>[Bid] update_bid_amount(passenger_user_email, ride_id, amount)<<<<<<<<<<<<<<<<<<




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

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<


 CREATE OR REPLACE FUNCTION delete_bid(bid_passenger_user_email varchar(254), bid_ride_id int4)
  
  RETURNS BOOLEAN
AS $$
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


>>>>>>>>>>>>>>>>>>>>[Ride] add_ride(start_location, start_datetime, end_location, end_datetime, pax,starting_bid, bid_closing_time)>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<
CREATE OR REPLACE FUNCTION add_ride(ride_start_location varchar(100), ride_start_datetime timestamp, ride_end_location varchar(100), ride_end_datetime timestamp, ride_pax int4, ride_starting_bid money, ride_bid_closing_time timestamp, ride_driver_ic_num char(9), ride_vehicle_car_plate char(8) )

RETURNS BOOLEAN
AS $$
BEGIN
INSERT INTO ride
(start_location, start_datetime, end_location, end_datetime, pax, starting_bid, bid_closing_time, driver_ic_num, vehicle_car_plate, is_deleted)
VALUES
(ride_start_location, ride_start_datetime, ride_end_location, ride_end_datetime, ride_pax, ride_starting_bid, ride_bid_closing_time, ride_driver_ic_num, ride_vehicle_car_plate, false );
RETURN true;
END;
$$
LANGUAGE plpgsql;
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<[Ride] get_ride_successful_bids(id)<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



CREATE OR REPLACE FUNCTION get_ride_successful_bids("id" int4)

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
AND B.ride_id = "id";
END
$func$
LANGUAGE plpgsql
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,






















