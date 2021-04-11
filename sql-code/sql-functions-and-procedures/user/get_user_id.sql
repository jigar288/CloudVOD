-- Function to get user id. Returns NULL if it doesn't exist

DROP FUNCTION IF EXISTS get_user_id(user_email VARCHAR);

CREATE FUNCTION get_user_id(user_email VARCHAR)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE associated_user_id INTEGER;
BEGIN    
    SELECT id INTO associated_user_id FROM public.users WHERE email=user_email;
    RETURN associated_user_id;
END; $$

-- SELECT * FROM get_user_id('jigar@uic.edu');