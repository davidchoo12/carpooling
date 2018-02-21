create table "user" (
	email_address varchar(100) primary key,
	name          varchar(100) not null,
	password      varchar(100) not null,
	contact       integer not null
)