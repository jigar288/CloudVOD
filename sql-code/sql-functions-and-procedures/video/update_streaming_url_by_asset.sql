DROP PROCEDURE IF EXISTS update_streaming_url_by_asset;

CREATE PROCEDURE update_streaming_url_by_asset(new_streaming_url VARCHAR, original_asset_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.video SET streaming_url=new_streaming_url WHERE output_asset_name = original_asset_name::uuid;
END; $$;

-- CALL update_streaming_url_by_asset('exampleStreamingURL.com', 'c6f30270-8aa6-11eb-8dcd-0242ac130003')