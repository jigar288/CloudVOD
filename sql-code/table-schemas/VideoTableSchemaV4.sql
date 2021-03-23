CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS video;

CREATE TABLE video(
    video_id SERIAL PRIMARY KEY NOT NULL,
    video_title VARCHAR (100) NOT NULL,
    video_description VARCHAR (5000),
    streaming_url VARCHAR (160) UNIQUE,
    output_asset_name UUID UNIQUE NOT NULL,
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category_id INT REFERENCES category(category_id),
    user_id INT REFERENCES users(user_id)
);