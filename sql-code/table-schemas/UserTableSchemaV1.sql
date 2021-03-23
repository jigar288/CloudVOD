DROP TABLE IF EXISTS users;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY NOT NULL,
    user_name VARCHAR (50) UNIQUE,
    user_email VARCHAR (50) UNIQUE
);