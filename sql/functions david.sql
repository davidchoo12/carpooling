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