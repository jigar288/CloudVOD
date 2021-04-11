DROP FUNCTION IF EXISTS get_categories_for_video_id;

CREATE FUNCTION get_categories_for_video_id(given_video_id INT)
RETURNS TABLE (category_id INT, video_id INT, name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT video_categories.category_id, video_categories.video_id, category.name FROM video_categories INNER JOIN category ON video_categories.category_id=category.id WHERE video_categories.video_id=given_video_id;
END; $$;