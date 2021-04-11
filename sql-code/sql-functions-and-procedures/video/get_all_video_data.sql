-- optimize this by only getting wanted cols efficiently: https://stackoverflow.com/questions/29095281/how-to-select-all-the-columns-of-a-table-except-one-column/46108719

DROP FUNCTION IF EXISTS get_all_video_data;

CREATE FUNCTION get_all_video_data()
RETURNS TABLE (id INT, title VARCHAR, description VARCHAR, streaming_url VARCHAR, upload_date DATE, is_public BOOLEAN, thumbnail_url VARCHAR, user_name VARCHAR, email VARCHAR, profile_url VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT 
        video.id,
        video.title,
        video.description,
        video.streaming_url,
        video.upload_date,
        video.is_public,
        video.thumbnail_url,
        users.name AS user_name,
        users.email,
        users.profile_url
    FROM public.video 
    INNER JOIN public.users ON users.id=video.user_id
    WHERE public.video.streaming_url IS NOT NULL;
END; $$;


-- FIXME: incrementally debug this & narrowing down syntax issue by removing small parts of statement
-- SELECT * FROM get_all_video_data();

-- !fixme: USE TYPES WHEN RETURNING DATA TO TYPESCRIPT api


