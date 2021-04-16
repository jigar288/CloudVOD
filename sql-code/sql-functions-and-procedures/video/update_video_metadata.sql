DROP PROCEDURE IF EXISTS update_video_metadata;

CREATE PROCEDURE update_video_metadata(new_streaming_url VARCHAR, given_thumbnail_url VARCHAR, original_asset_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.video SET streaming_url=new_streaming_url, thumbnail_url=given_thumbnail_url WHERE output_asset_name = original_asset_name::uuid;
END; $$;