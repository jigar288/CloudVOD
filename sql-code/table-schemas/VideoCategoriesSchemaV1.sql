DROP TABLE IF EXISTS video_categories;

CREATE TABLE video_categories(
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES category(id),    
    video_id INT REFERENCES video(id) 
);