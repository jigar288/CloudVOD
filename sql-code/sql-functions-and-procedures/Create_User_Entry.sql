-- function to creates new user entry
-- possible improvements?

DROP PROCEDURE IF EXISTS create_user_entry;

CREATE PROCEDURE create_user_entry(user_email VARCHAR, user_name VARCHAR)
LANGUAGE SQL
AS $$
BEGIN
    INSERT INTO public.users (user_email, user_name) VALUES (user_email, user_name);
END;$$

-- CALL create_user_entry('jignesh@uic.edu', 'JKP');

