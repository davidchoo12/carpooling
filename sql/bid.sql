create table Bid (
	email varchar(100) not null,
	ride_id int not null,
	amount int,
	date timestamp,
	primary key (email, ride_id),
	foreign key (email) references passenger (email),
	foreign key (ride_id) references ride (id)
);
	
