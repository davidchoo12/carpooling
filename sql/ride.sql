create table Ride(
	id int not null primary key,
	start_location varchar(100),
	end_location varchar(100),
	pax int,
	initial_bid int not null,
	close_time timestamp not null,
	driver_email varchar(100) not null references driver(email)
);


INSERT INTO staff(id, username, password) VALUES (1, 'Sooyeon', 'password1');
INSERT INTO staff(id, username, password) VALUES (2, 'Yingying', 'password2');
INSERT INTO staff(id, username, password) VALUES (3, 'Cindy', 'password3');
INSERT INTO staff(id, username, password) VALUES (4, 'David', 'password4');
INSERT INTO staff(id, username, password) VALUES (5, 'Harry', 'password5');

select * from staff;
