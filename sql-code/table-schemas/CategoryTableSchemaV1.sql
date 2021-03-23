DROP TABLE IF EXISTS category;

CREATE TABLE category(
    category_id SERIAL PRIMARY KEY NOT NULL,
    category_name VARCHAR (50) UNIQUE
);