import { connectionPool } from "../util/connection-util";
import { Reimbursement } from "../model/Reimbursement";
import { reimbursementConverter } from "../util/reimbursement-converter";
import { SqlReimbursement } from "../dto/sql_reimbursement";
import { User } from "../model/user";

/**
 * Retreive all reimbursements from the database
 */
export async function findAll(id: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_reimbursement r 
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id)
    WHERE r.reimb_author = $1`, [id]);
    return resp.rows.map(reimbursementConverter);
  } finally {
    client.release();
  }
}

/**
 * Retreive a reimbursement by its id
 * @param id 
 */
export async function findById(id: number): Promise<Reimbursement> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_reimbursement r 
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id) 
    WHERE r.reimb_id = $1`, [id]);
    let reimbursement: SqlReimbursement = resp.rows[0];
    if (reimbursement !== undefined) {
      return reimbursementConverter(reimbursement);
    } else {
      return undefined;
    }
  } finally {
    client.release();
  }
}

/**
 * Retreive a reimbursement by its id
 * @param id 
 */
export async function findPending(id: number): Promise<Reimbursement> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_reimbursement r 
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id) 
    WHERE r.reimb_status_id = 1 AND r.reimb_author = $1`, [id]);
    let reimbursement: SqlReimbursement = resp.rows[0];
    if (reimbursement !== undefined) {
      return reimbursementConverter(reimbursement);
    } else {
      return undefined;
    }
  } finally {
    client.release();
  }
}

/**
 * Retreive a reimbursement by its id
 * @param id 
 */
export async function findApproved(id: number): Promise<Reimbursement> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_reimbursement r 
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id) 
    WHERE r.reimb_status_id = 2 AND r.reimb_author = $1`, [id]);
    let reimbursement: SqlReimbursement = resp.rows[0];
    if (reimbursement !== undefined) {
      return reimbursementConverter(reimbursement);
    } else {
      return undefined;
    }
  } finally {
    client.release();
  }
}

/**
 * Retreive a reimbursement by its id
 * @param id 
 */
export async function findDenied(id: number): Promise<Reimbursement> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_reimbursement r 
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id) 
    WHERE reimb_status_id = 3 AND r.reimb_author = $1`, [id]);
    let reimbursement: SqlReimbursement = resp.rows[0];
    if (reimbursement !== undefined) {
      return reimbursementConverter(reimbursement);
    } else {
      return undefined;
    }
  } finally {
    client.release();
  }
}

/**
 * Add a new reimbursement to the DB
 * @param movie 
 */
export async function createReimbursement(reimbursement: SqlReimbursement): Promise<number> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(
      `INSERT INTO ers.ers_reimbursement 
        (reimb_amount, reimb_description, 
          reimb_author, reimb_status_id, reimb_type_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING reimb_id`, [reimbursement.reimb_amount, reimbursement.reimb_description, 
          reimbursement.reimb_author, reimbursement.reimb_status_id, reimbursement.reimb_type_id]);
    return resp.rows[0].reimb_id;
  } finally {
    client.release();
  }
}

export async function updateReimbursement(reimbursement: SqlReimbursement): Promise<number> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(
      `UPDATE ers.ers_reimbursement 
        SET reimb_receipt = $1, reimb_resolver = $2, reimb_status_id = $3
        WHERE reimb_id = $4
        RETURNING reimb_id`, [reimbursement.reimb_receipt, 
          reimbursement.reimb_resolver, reimbursement.reimb_status_id, reimbursement.reimb_id]);
    return resp.rows[0].reimb_id;
  } finally {
    client.release();
  }
}