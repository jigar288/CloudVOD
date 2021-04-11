DROP FUNCTION IF EXISTS example_function_name;

CREATE FUNCTION example_function_name()
RETURNS TABLE (column_name INT, column_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    -- RETURN SELECT * FROM table_name;
END; $$;