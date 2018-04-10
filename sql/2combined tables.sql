--------------------------------------------------------------------------------------------------
CREATE TABLE public."user"
(
    email character varying(254) NOT NULL,
    name character varying(100) NOT NULL,
    contact character(8) NOT NULL,
    password character varying(100) NOT NULL,
    is_staff boolean NOT NULL,
    is_deleted boolean NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (email),
    CONSTRAINT valid_contact CHECK (contact ~* '^\d{8}$'::text),
    CONSTRAINT valid_email CHECK (email::text ~* '^[a-z0-9._%-]+@[a-z0-9._%-]+\.[a-z]{2,4}$'::text)
);


--------------------------------------------------------------------------------------------------
CREATE TABLE public.passenger
(
    user_email character varying(254) NOT NULL,
    CONSTRAINT passenger_pkey PRIMARY KEY (user_email),
    CONSTRAINT passenger_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public."user" (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


--------------------------------------------------------------------------------------------------
CREATE TABLE public.driver
(
    ic_num character(9) NOT NULL,
    user_email character varying(254) NOT NULL,
    CONSTRAINT driver_pkey PRIMARY KEY (ic_num),
    CONSTRAINT driver_user_email_key UNIQUE (user_email),
    CONSTRAINT driver_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public."user" (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT valid_ic_num CHECK (ic_num ~* '^[a-z][0-9]{7}[a-z]$'::text)
);

--------------------------------------------------------------------------------------------------
CREATE TABLE public.vehicle
(
    car_plate character(8) NOT NULL,
    model character varying(100) NOT NULL,
    seat integer NOT NULL,
    is_deleted boolean NOT NULL,
    driver_ic_num character(9) NOT NULL,
    CONSTRAINT vehicle_pkey PRIMARY KEY (car_plate),
    CONSTRAINT vehicle_driver_ic_num_fkey FOREIGN KEY (driver_ic_num)
        REFERENCES public.driver (ic_num) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT valid_car_plate CHECK (car_plate::text ~* '^[a-z]{3}[0-9]{4}[a-z]$'::text),
    CONSTRAINT valid_seat CHECK (seat >= 1 AND seat <= 10)
);

--------------------------------------------------------------------------------------------------
CREATE TABLE public.ride
(
    id integer NOT NULL DEFAULT nextval('ride_id_seq'::regclass),
    start_location character varying(100) NOT NULL,
    start_datetime timestamp without time zone NOT NULL,
    end_location character varying(100) NOT NULL,
    end_datetime timestamp without time zone NOT NULL,
    pax integer NOT NULL,
    starting_bid money NOT NULL,
    bid_closing_time timestamp without time zone NOT NULL,
    is_deleted boolean NOT NULL,
    driver_ic_num character(9) NOT NULL,
    vehicle_car_plate character(8) NOT NULL,
    CONSTRAINT ride_pkey PRIMARY KEY (id),
    CONSTRAINT ride_driver_ic_num_fkey FOREIGN KEY (driver_ic_num)
        REFERENCES public.driver (ic_num) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT ride_vehicle_car_plate_fkey FOREIGN KEY (vehicle_car_plate)
        REFERENCES public.vehicle (car_plate) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT valid_starting_bid CHECK (starting_bid > 0::money AND starting_bid <= 9999::money),
    CONSTRAINT valid_pax CHECK (pax >= 1 AND pax <= 10),
    CONSTRAINT valid_start_datetime CHECK (start_datetime < end_datetime AND start_datetime >= (now() + '01:00:00'::interval)),
    CONSTRAINT valid_bid_closing_time CHECK (bid_closing_time < start_datetime AND bid_closing_time > now())
);


--------------------------------------------------------------------------------------------------
CREATE TABLE public.bid
(
    passenger_user_email character varying(254) NOT NULL,
    ride_id integer NOT NULL,
    amount money NOT NULL,
    "time" timestamp without time zone NOT NULL,
    is_deleted boolean NOT NULL,
    CONSTRAINT bid_pkey PRIMARY KEY (passenger_user_email, ride_id),
    CONSTRAINT bid_passenger_user_email_fkey FOREIGN KEY (passenger_user_email)
        REFERENCES public.passenger (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT bid_ride_id_fkey FOREIGN KEY (ride_id)
        REFERENCES public.ride (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);