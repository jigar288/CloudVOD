DROP PROCEDURE IF EXISTS example_procedure_name(parameter_example VARCHAR);

CREATE PROCEDURE example_procedure_name(parameter_example VARCHAR);
LANGUAGE plpgsql
AS $$
BEGIN
    -- INSERT INTO public.table_name (parameter_example) VALUES (parameter_example);
END;$$