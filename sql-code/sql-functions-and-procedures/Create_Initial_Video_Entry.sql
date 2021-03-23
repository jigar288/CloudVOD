DROP PROCEDURE IF EXISTS create_initial_video_entry;

CREATE PROCEDURE create_initial_video_entry(video_title VARCHAR, video_description VARCHAR, output_asset_name VARCHAR, upload_date DATE, category_id INT, user_email VARCHAR, user_name VARCHAR)
LANGUAGE plpgsql
AS $$
DECLARE user_id INTEGER := get_user_id(user_email);
BEGIN
    -- create user record if doesn't exist
    IF user_id IS NULL THEN
        CALL create_user_entry(user_email, user_name);    
        user_id := get_user_id(user_email);                
    END IF;     

    -- create db record for all metadata
    INSERT INTO public.video (video_title, video_description, output_asset_name, upload_date, category_id, user_id) VALUES (video_title, video_description, output_asset_name::uuid, upload_date, category_id, user_id);    
END; $$;

-- don't have to check for valid key?
-- CALL create_initial_video_entry('Thor 2', 'I am from asgard', '441f74fa-8b4b-11eb-8dcd-0242ac130003', '2019-02-02', 30, 'samsung7@uic.edu', 'SP7')