DROP PROCEDURE IF EXISTS create_user_entry(name VARCHAR, email VARCHAR, profile_url VARCHAR);

CREATE PROCEDURE create_user_entry(name VARCHAR, email VARCHAR, profile_url VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.users (name, email, profile_url) VALUES (name, email, profile_url);
END;$$


-- CALL create_user_entry('Jigar Patel', 'jigar@novusclub.org', 'jigarbpatel.com/profile');

