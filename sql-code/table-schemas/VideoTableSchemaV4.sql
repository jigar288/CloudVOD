CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS video;

CREATE TABLE video(
    id SERIAL PRIMARY KEY,
    title VARCHAR (100) NOT NULL,
    description VARCHAR (5000),
    streaming_url VARCHAR (160) UNIQUE,
    output_asset_name UUID UNIQUE NOT NULL,
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    thumbnail_url VARCHAR (115) UNIQUE,
    user_id INT REFERENCES users(id)
);

/*
    Note: when returning all video metadata - use the videoID to make separate query to the video_categories table to get associated categories
*/