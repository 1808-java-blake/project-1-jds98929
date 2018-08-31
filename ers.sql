SET SCHEMA 'ers';

-- CREATE TABLE ers_reimbursement_type
-- (
--   reimb_type_id SERIAL PRIMARY KEY,
--   reimb_type VARCHAR(10)
-- );
-- 
-- CREATE TABLE ers_reimbursement
-- (
--   reimb_id SERIAL PRIMARY KEY,
--   reimb_amount NUMERIC(6,2),
--   reimb_submitted TIMESTAMP DEFAULT now(),
--   reimb_resolved TIMESTAMP,
--   reimb_description VARCHAR(250),
--   reimb_receipt BYTEA,
--   reimb_author INTEGER REFERENCES ers_users(ers_users_id),
--   reimb_resolver INTEGER REFERENCES ers_users(ers_users_id),
--   reimb_status_id INTEGER REFERENCES ers_reimbursement_status(reimb_status_id),
--   reimb_type_id INTEGER REFERENCES ers_reimbursement_type(reimb_type_id)
-- );

CREATE OR REPLACE FUNCTION update_reimbursement_trig()
RETURNS TRIGGER AS $$
BEGIN
    IF(TG_OP = 'UPDATING') THEN
	UPDATE ers_reimbursement
	SET reimb_resolved = now()
	WHERE NEW.reimb_status_id <> OLD.reimb_status_id;
    END IF;
    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reimbursement_trigger
AFTER UPDATE ON ers_reimbursement
FOR EACH ROW
EXECUTE PROCEDURE update_reimbursement_trig();



-- INSERT INTO ers_reimbursement_status (reimb_status)
-- VALUES ('Pending');
-- 
-- 
-- INSERT INTO ers_reimbursement_status (reimb_status)
-- VALUES ('Approved');
-- 
-- 
-- INSERT INTO ers_reimbursement_status (reimb_status)
-- VALUES ('Denied');


-- INSERT INTO ers_reimbursement_type (reimb_type)
-- VALUES ('Lodging');
-- 
-- 
-- INSERT INTO ers_reimbursement_type (reimb_type)
-- VALUES ('Travel');
-- 
-- INSERT INTO ers_reimbursement_type (reimb_type)
-- VALUES ('Food');
-- 
-- 
-- INSERT INTO ers_reimbursement_type (reimb_type)
-- VALUES ('Other');

-- INSERT INTO ers_user_roles (user_role)
-- VALUES ('Employee');
-- 
-- INSERT INTO ers_user_roles (user_role)
-- VALUES ('Manager');

