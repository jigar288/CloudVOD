-- Function to get user id. Returns NULL if it doesn't exist

DROP FUNCTION IF EXISTS get_user_id;

CREATE FUNCTION get_user_id(given_user_email VARCHAR)
RETURNS INT
AS $$
DECLARE associated_user_id INTEGER;
BEGIN    
    SELECT user_id INTO associated_user_id FROM public.users WHERE user_email=given_user_email;
    RETURN associated_user_id;
END; $$

LANGUAGE 'plpgsql';

-- SELECT * FROM get_user_id('jigar@uic.edu');