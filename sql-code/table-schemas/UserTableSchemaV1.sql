DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    email VARCHAR (50) UNIQUE NOT NULL,
    profile_url VARCHAR (130) UNIQUE NOT NULL
);
