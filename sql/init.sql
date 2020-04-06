CREATE TABLE public.users (
  user_id character varying(36) PRIMARY KEY not null,
  user_name character varying(36) not null,
  timestamp numeric NOT NULL,
  user_email character varying(256) not null
);

CREATE TABLE public.characters (
  character_id character varying(36) PRIMARY KEY not null,
  hit_points numeric,
  armor_class numeric,
  name character varying(256) not null
);

CREATE TABLE public.events (
  event_id character varying(36) PRIMARY KEY not null,
  event_type character varying(25),
  creator_id character varying(36),
  timestamp numeric NOT NULL,
  description character varying(256) NOT NULL,
  rolls json,
  skill character varying(25),
  damage_type character varying(25),
  target character varying(256)
);