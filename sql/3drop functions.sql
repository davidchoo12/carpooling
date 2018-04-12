--[DROP: UPDATE]
DROP FUNCTION IF EXISTS public.update_passenger(varchar, char, varchar);
DROP FUNCTION IF EXISTS public.update_driver(char, char, varchar);
DROP FUNCTION IF EXISTS public.update_ride(INTEGER, varchar, timestamp, varchar, timestamp, INTEGER, money, timestamp);
DROP FUNCTION IF EXISTS public.update_vehicle(char, varchar, INTEGER);
DROP FUNCTION IF EXISTS public.update_bid_amount(bid_passenger_user_email varchar(254), bid_ride_id INTEGER, bid_amount money);


--[DROP: DELETE]
DROP FUNCTION IF EXISTS public.delete_passenger(passenger_email varchar);
DROP FUNCTION IF EXISTS public.delete_driver(driver_email varchar);
DROP FUNCTION IF EXISTS public.delete_vehicle(char);
DROP FUNCTION IF EXISTS public.delete_ride(INTEGER);
DROP FUNCTION IF EXISTS public.delete_bid(bid_passenger_user_email varchar(254), bid_ride_id INTEGER);


--[DROP: ADD]
DROP FUNCTION IF EXISTS public.add_bid(varchar, INTEGER, money);
DROP FUNCTION IF EXISTS public.add_driver(char, varchar, varchar, char, varchar);
DROP FUNCTION IF EXISTS public.add_passenger(varchar, varchar, char, varchar);
DROP FUNCTION IF EXISTS public.add_vehicle(vehicle_car_plate char, vehicle_model varchar, vehicle_seat INTEGER, vehicle_driver_ic_num char);
DROP FUNCTION IF EXISTS public.add_ride(ride_start_location varchar, ride_start_datetime timestamp, ride_end_location varchar, ride_end_datetime timestamp, ride_pax INTEGER, ride_starting_bid money, ride_bid_closing_time timestamp, ride_driver_ic_num char, ride_vehicle_car_plate char);


--[DROP: GET]
DROP FUNCTION IF EXISTS public.get_all_rides();
DROP FUNCTION IF EXISTS public.get_ride_by_id(ride_id INTEGER);
DROP FUNCTION IF EXISTS public.get_rides_by_driver_ic_num(ride_driver_ic_num char);
DROP FUNCTION IF EXISTS public.get_rides_by_vehicle_car_plate(ride_vehicle_car_plate char);
DROP FUNCTION IF EXISTS public.get_all_bids();
DROP FUNCTION IF EXISTS public.get_bids_by_id(bid_passenger_user_email varchar, bid_ride_id INTEGER);
DROP FUNCTION IF EXISTS public.get_vehicle_by_driver_ic_num(vehicle_driver_ic_num char);
DROP FUNCTION IF EXISTS public.get_ride_successful_bids("id" INTEGER);
DROP FUNCTION IF EXISTS public.get_staff_by_email(varchar);
DROP FUNCTION IF EXISTS public.get_passenger_by_email(passenger_email varchar);
DROP FUNCTION IF EXISTS public.get_driver_by_email(driver_email varchar);


--[DROP: SEARCH]
DROP FUNCTION IF EXISTS public.search_rides(ride_start_location varchar, ride_start_datetime timestamp, ride_end_location varchar, ride_end_datetime timestamp, ride_pax INTEGER, ride_starting_bid money, ride_bid_closing_time timestamp);