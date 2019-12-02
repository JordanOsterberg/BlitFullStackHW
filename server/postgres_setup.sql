BEGIN;

CREATE TABLE IF NOT EXISTS public.historical_data (
    id integer DEFAULT nextval('id_seq'::regclass) NOT NULL,
    city_name text NOT NULL,
    city_zip integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    temperature double precision NOT NULL,
    PRIMARY KEY(id)
);

COMMIT;