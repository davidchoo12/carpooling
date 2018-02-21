create table passenger (
  email varchar(100) references "user"(email) not null,
  primary key(email)
)

