DROP PROCEDURE IF EXISTS create_initial_video_entry;

CREATE PROCEDURE create_initial_video_entry(title VARCHAR, description VARCHAR, given_output_asset_name VARCHAR, upload_date DATE, category_IDs int[], user_email VARCHAR, user_profile_url VARCHAR, name VARCHAR, is_public BOOLEAN)
LANGUAGE plpgsql
AS $$
DECLARE userID INTEGER := get_user_id(user_email);
DECLARE video_id INTEGER;
DECLARE category_entry INT;
BEGIN
    -- create user record if doesn't exist
    IF userID IS NULL THEN
        CALL create_user_entry(name, user_email, user_profile_url);
        userID := get_user_id(user_email);                
    END IF;     

    -- create db record for all metadata
    INSERT INTO public.video (title, description, output_asset_name, upload_date, is_public, user_id) VALUES (title, description, given_output_asset_name::uuid, upload_date, is_public, userID);    
    
    -- get video_id
    SELECT id INTO video_id FROM public.video WHERE output_asset_name=given_output_asset_name::uuid;
    
    CALL enter_video_categories(video_id, category_IDs);
END; $$;

-- CALL create_initial_video_entry('Demon Slayer Trailer', 'Join Tanjoro on his journey to slay demons', 'bf2f390e-9a56-11eb-a8b3-0242ac130003', '2019-02-02', ARRAY [ 2,1 ], 'jpate218@uic.edu', 'photos.google.com/jigar-profile', 'JP', TRUE)

