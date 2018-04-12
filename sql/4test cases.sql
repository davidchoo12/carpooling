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
select get_ride_successful_bids(13);

SELECT * FROM get_all_bids();
SELECT * FROM get_bids_by_id('passenger@gmail.com','1');
SELECT * FROM get_bids_by_passenger_user_email('passenger@gmail.com');
SELECT * FROM get_bids_by_ride_id(1);
SELECT * FROM get_vehicle_by_driver_ic_num('S1234567B');

select add_passenger('S1234567B', 'passenger1@gmail.com', 'name1','12341234','pass1')
select add_passenger('S1234567C', 'passenger2@gmail.com', 'name2','12341234','pass2')
select add_passenger('S1234567D', 'passenger3@gmail.com', 'name3','12341234','pass3')

select add_ride('Kent Ridge MRT', TIMESTAMP '2018-4-12 10:23:54', 'Jurong Point', TIMESTAMP '2018-4-12 12:23:54', 2, 5::money, TIMESTAMP '2018-4-11 10:23:54', 'S2222222B', 'SAG2222G')
select add_bid('passenger1@gmail.com', 13, 5::money)
select add_bid('passenger2@gmail.com', 13, 6::money)
select add_bid('passenger3@gmail.com', 13, 7::money)
select update_bid_amount('passenger1@gmail.com', 13, 8::money)