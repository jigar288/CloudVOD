-- optimize this by only getting wanted cols efficiently: https://stackoverflow.com/questions/29095281/how-to-select-all-the-columns-of-a-table-except-one-column/46108719

DROP FUNCTION IF EXISTS get_all_video_data;

CREATE FUNCTION get_all_video_data()
RETURNS TABLE (video_id INT, video_title VARCHAR, video_description VARCHAR, streaming_url VARCHAR, upload_date DATE, category_id INT, category_name VARCHAR, user_id INT, user_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT 
        video.video_id AS video_id,
        video.video_title AS video_title,
        video.video_description AS video_description,
        video.streaming_url AS streaming_url,
        video.upload_date AS upload_date,
        category.category_id AS category_id,
        category.category_name AS category_name,
        users.user_id AS user_id,
        users.user_name AS user_name
    FROM public.video 
    INNER JOIN public.category ON video.category_id=category.category_id 
    INNER JOIN public.users ON video.user_id=users.user_id
    WHERE video.streaming_url IS NOT NULL;                
END; $$;

-- FIXME: incrementally debug this & narrowing down syntax issue by removing small parts of statement
-- SELECT * FROM get_all_video_data();
