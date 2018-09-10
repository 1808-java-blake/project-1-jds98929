import { connectionPool } from "../util/connection-util";
import { Reimbursement } from "../model/Reimbursement";
import { reimbursementConverter } from "../util/reimbursement-converter";
import { SqlReimbursement } from "../dto/sql_reimbursement";
import { User } from "../model/user";
import { userConverter } from "../util/user-converter";

/**
 * Retreive all reimbursements
 */
export async function find(): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u 
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id)
    WHERE r.reimb_id <> 0
    ORDER BY r.reimb_id`);
    const reimbursements=[];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      reimbursements.push(reimbursement);
    });
    return reimbursements;
  } finally {
    client.release();
  }
}

/**
 * Retreive all reimbursements by status
 * @param statusId
 */
export async function findByStatus(statusId: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u 
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id)
    WHERE r.reimb_status_id = $1
    ORDER BY r.reimb_id`, [statusId]);
    const reimbursements=[];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      reimbursements.push(reimbursement);
    });
    return reimbursements;
  } finally {
    client.release();
  }
}

/**
 * Retreive all of a user's reimbursements from the database
 * @param authorId
 */
export async function findAll(authorId: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u 
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id)
    WHERE r.reimb_author = $1
    ORDER BY r.reimb_id`, 
    [authorId]);
    const reimbursements=[];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      reimbursements.push(reimbursement);
    });
    return reimbursements;
  } finally {
    client.release();
  }
}

/**
 * Retreive reimbursements by author name and status
 * @param firstName
 * @param lastName
 * @param statusId
 */
export async function findByName(firstName: string, lastName: string, statusId: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u 
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id)
    WHERE u.user_first_name = $1 AND u.user_last_name = $2 AND r.reimb_status_id = $3
    ORDER BY r.reimb_id`, 
    [firstName, lastName, statusId]);
    const reimbursements=[];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      reimbursements.push(reimbursement);
    });
    return reimbursements;
  } finally {
    client.release();
  }
}

/**
 * Retreive reimbursements by author name
 * @param firstName
 * @param lastName
 */
export async function findAllByName(firstName: string, lastName: string): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u 
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id)
    WHERE u.user_first_name = $1 AND u.user_last_name = $2
    ORDER BY r.reimb_id`, 
    [firstName, lastName]);
    const reimbursements=[];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      reimbursements.push(reimbursement);
    });
    return reimbursements;
  } finally {
    client.release();
  }
}

/**
 * Retreive a reimbursement by its id
 * @param reimbursementId 
 */
export async function findById(reimbursementId: number): Promise<Reimbursement> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id) 
    WHERE r.reimb_id = $1
    ORDER BY r.reimb_id`, [reimbursementId]);
    const user_reimbursement_result = resp.rows[0];
    if (user_reimbursement_result !== undefined) {
      return reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
    } else {
      return undefined;
    }
  } finally {
    client.release();
  }
}

/**
 * Retreive pending reimbursements
 * @param authorId 
 */
export async function findPending(authorId: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author 
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id) 
    WHERE r.reimb_status_id = 1 AND r.reimb_author = $1
    ORDER BY r.reimb_id`, [authorId]);
    const reimbursements=[];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      reimbursements.push(reimbursement);
    });
    return reimbursements;
  } finally {
    client.release();
  }
}

/**
 * Retreive approved reimbursements
 * @param authorId 
 */
export async function findApproved(authorId: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author 
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id) 
    WHERE r.reimb_status_id = 2 AND r.reimb_author = $1
    ORDER BY r.reimb_id`, [authorId]);
    const reimbursements=[];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      reimbursements.push(reimbursement);
    });
    return reimbursements;
  } finally {
    client.release();
  }
}

/**
 * Retreive denied reimbursements
 * @param authorId 
 */
export async function findDenied(authorId: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(`SELECT * FROM ers.ers_users u
    LEFT JOIN ers.ers_reimbursement r ON u.ers_users_id = r.reimb_author 
    LEFT JOIN ers.ers_reimbursement_status rs USING(reimb_status_id) 
    LEFT JOIN ers.ers_reimbursement_type rt USING(reimb_type_id) 
    WHERE r.reimb_status_id = 3 AND r.reimb_author = $1
    ORDER BY r.reimb_id`, [authorId]);
    const reimbursements=[];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      reimbursements.push(reimbursement);
    });
    return reimbursements;
  } finally {
    client.release();
  }
}

/**
 * Add a new reimbursement to the DB
 * @param reimbursement
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
/**
 * Update a reimbursement
 * @param reimbursement 
 */
export async function updateReimbursement(reimbursement: SqlReimbursement): Promise<number> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(
      `UPDATE ers.ers_reimbursement 
        SET reimb_resolver = $1, reimb_status_id = $2
        WHERE reimb_id = $3
        RETURNING reimb_id`, 
        [reimbursement.reimb_resolver, reimbursement.reimb_status_id, reimbursement.reimb_id]);
    return resp.rows[0].reimb_id;
  } finally {
    client.release();
  }
}

