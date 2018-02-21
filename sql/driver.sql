create table driver (
  email varchar(100) references "user"(email) not null,
  ic_number     varchar(100) not null,
  licence       varchar(100) not null,
  primary key(email)
)
