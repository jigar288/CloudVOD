DROP FUNCTION IF EXISTS get_categories;

CREATE FUNCTION get_categories()
RETURNS TABLE (category_id INT, category_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT * FROM category;                
END; $$;

-- SELECT * FROM get_categories()