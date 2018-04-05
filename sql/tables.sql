create table "user" (
  email     varchar(100) primary key,
  name      varchar(100) not null,
  contact   integer not null,
  password  varchar(100) not null,
  is_staff  boolean not null,
  is_deleted boolean not null
);

create table passenger (
  user_email varchar(100) references "user"(email) not null on delete no action on update no action,
  primary key(user_email)
);

create table driver (
  ic_num     varchar(100) primary key,
  user_email varchar(100) references "user"(email) not null unique on delete no action on update no action
);

create table ride (
  id varchar(100) primary key,
  start_location varchar(100) not null,
  start_datetime timestamp not null,
  end_location varchar(100) not null,
  end_datetime timestamp not null,
  pax integer not null,
  starting_bid money,
  bid_closing_time timestamp,
  is_deleted boolean,
  driver_ic_num varchar(100) references driver(ic_num) on delete no action on update no action,
  vehicle_car_plate varchar(100) references vehicle(car_plate) on delete no action on update no action
);

create table bid (
	email varchar(100) not null,
	ride_id int not null,
	amount int,
	date timestamp,
	primary key (email, ride_id),
	foreign key (email) references passenger (email) on delete no action on update no action,
	foreign key (ride_id) references ride (id) on delete no action on update no action
);