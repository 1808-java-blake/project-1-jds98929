CREATE TABLE ers.ers_reimbursement
(
  reimb_id serial NOT NULL,
  reimb_amount numeric(6,2),
  reimb_submitted timestamp without time zone DEFAULT now(),
  reimb_resolved timestamp without time zone,
  reimb_description character varying(250),
  reimb_receipt bytea,
  reimb_author integer,
  reimb_resolver integer,
  reimb_status_id integer,
  reimb_type_id integer,
  CONSTRAINT ers_reimbursement_pkey PRIMARY KEY (reimb_id),
  CONSTRAINT ers_reimbursement_reimb_author_fkey FOREIGN KEY (reimb_author)
      REFERENCES ers.ers_users (ers_users_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT ers_reimbursement_reimb_resolver_fkey FOREIGN KEY (reimb_resolver)
      REFERENCES ers.ers_users (ers_users_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT ers_reimbursement_reimb_status_id_fkey FOREIGN KEY (reimb_status_id)
      REFERENCES ers.ers_reimbursement_status (reimb_status_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT ers_reimbursement_reimb_type_id_fkey FOREIGN KEY (reimb_type_id)
      REFERENCES ers.ers_reimbursement_type (reimb_type_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE ers.ers_reimbursement
  OWNER TO postgres;

-- Trigger: update_reimbursement_trigger on ers.ers_reimbursement

-- DROP TRIGGER update_reimbursement_trigger ON ers.ers_reimbursement;

CREATE TRIGGER update_reimbursement_trigger
  BEFORE UPDATE
  ON ers.ers_reimbursement
  FOR EACH ROW
  EXECUTE PROCEDURE ers.update_reimbursement_trig();

CREATE TABLE ers.ers_reimbursement_status
(
  reimb_status_id serial NOT NULL,
  reimb_status character varying(10),
  CONSTRAINT ers_reimbursement_status_pkey PRIMARY KEY (reimb_status_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE ers.ers_reimbursement_status
  OWNER TO postgres;

CREATE TABLE ers.ers_reimbursement_type
(
  reimb_type_id serial NOT NULL,
  reimb_type character varying(10),
  CONSTRAINT ers_reimbursement_type_pkey PRIMARY KEY (reimb_type_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE ers.ers_reimbursement_type
  OWNER TO postgres;

CREATE TABLE ers.ers_user_roles
(
  ers_user_role_id serial NOT NULL,
  user_role character varying(10),
  CONSTRAINT ers_user_roles_pkey PRIMARY KEY (ers_user_role_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE ers.ers_user_roles
  OWNER TO postgres;

CREATE TABLE ers.ers_users
(

)
WITH (
  OIDS=FALSE
);
ALTER TABLE ers.ers_users
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION ers.update_reimbursement_trig()
  RETURNS trigger AS
$BODY$
BEGIN

    IF NEW.reimb_status_id = 2 OR NEW.reimb_status_id = 3 THEN
    
	NEW.reimb_resolved = now();
	
    END IF;
    RETURN NEW; 
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION ers.update_reimbursement_trig()
  OWNER TO postgres;


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

