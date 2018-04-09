SELECT * FROM get.... (Method name)
-- Example: SELECT add_ride('aa', timestamp '2018-07-05 03:04:00', 'bb', timestamp '2018-09-07 03:04:00', 3, 4.00::money, timestamp '2018-06-07 03:04:00', 'S1234567B', 'SAG3412G');

--Vehicle (Add, delete, update)
SELECT add_vehicle('SGA1234A', 'BMW', '6', 'S1234567B');

SELECT delete_vehicle('SGA1234A');

SELECT update_vehicle('SGA1234A', 'Toyota', '5');

--Ride (Add, delete, update)
SELECT add_ride('rr', timestamp '2018-07-05 03:04:00', 'gg', timestamp '2018-09-07 03:04:00', 3, 4.00::money, timestamp '2018-06-07 03:04:00', 'S1234567B', 'SAG3412G');

SELECT delete_ride('10');

SELECT update_ride('9', 'updated', timestamp '2018-08-05 03:04:00', 'updas', timestamp '2018-09-07 03:05:00', 4, 5.00::money, timestamp '2018-06-07 03:04:00');

--Bid (Add, delete, update)
SELECT add_bid('passenger@gmail.com', '1', 5.00::money);

SELECT add_bid('passengerr@gmail.com', '1', 6.00::money);

SELECT delete_bid('passenger@gmail.com', '1');

SELECT update_bid_amount('passengerr@gmail.com', '1', 7.00::money)

--For GETS
SELECT * FROM get_all_rides();
SELECT * FROM get_ride_by_id(1);
SELECT * FROM get_ride_successful_bids(1);
SELECT * FROM get_rides_by_vehicle_car_plate('SGA1234A');

SELECT * FROM get_ride_successful_bids(1);
SELECT * FROM get_rides_by_driver_ic_num('S1234567B');
SELECT * FROM get_rides_by_vehicle_car_plate('SAG3412G');

SELECT * FROM get_all_bids();
SELECT * FROM get_bids_by_id('passenger@gmail.com','1');
SELECT * FROM get_bids_by_passenger_user_email('passenger@gmail.com');
SELECT * FROM get_bids_by_ride_id(1);