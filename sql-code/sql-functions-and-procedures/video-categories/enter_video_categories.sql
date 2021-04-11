DROP PROCEDURE IF EXISTS enter_video_categories(categoryIDs INT[]);

CREATE PROCEDURE enter_video_categories(video_id INT, categoryIDs INT[])
LANGUAGE plpgsql
AS $$
DECLARE category_record_id INT;
BEGIN
    FOREACH category_record_id IN ARRAY $2
    LOOP
        raise notice 'entering category with id: %', category_record_id;
        INSERT INTO public.video_categories (category_id, video_id) VALUES (category_record_id, video_id);
    END LOOP;
END;$$