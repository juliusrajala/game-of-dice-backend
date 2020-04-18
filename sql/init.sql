CREATE TABLE public.users (
  user_id character varying(36) PRIMARY KEY not null,
  user_name character varying(36) not null,
  timestamp numeric NOT NULL,
  user_email character varying(256) not null,
  accent_color character varying(7),
  is_admin boolean
);

CREATE TABLE public.rooms (
  room_id character varying(36) PRIMARY KEY,
  owner_id character varying(36) REFERENCES public.users(user_id),
  room_name character varying(36) not null,
  timestamp numeric NOT NULL
);


CREATE TABLE public.characters (
  character_id character varying(36) PRIMARY KEY not null,
  character_name character varying(256) not null,
  owner_id character varying(36) REFERENCES public.users(user_id),
  room_id character varying(36) REFERENCES public.rooms(room_id),
  hit_points numeric default 0,
  armor_class numeric default 0,
  attack_bonus numeric default 0,
  damage_taken numeric default 0,
  fortitude numeric default 0,
  reflex numeric default 0,
  will numeric default 0,
  initiative numeric default 0,
  level numeric default 0,
  class character varying(32) default ''
);

CREATE TABLE public.events (
  event_id character varying(36) PRIMARY KEY not null,
  event_type character varying(25),
  creator_id character varying(36) REFERENCES public.users(user_id),
  timestamp numeric NOT NULL,
  description character varying(256) NOT NULL,
  rolls json,
  skill character varying(25),
  damage_type character varying(25),
  target character varying(256) REFERENCES public.characters(character_id),
  room_id character varying(36) REFERENCES public.rooms(room_id)
);