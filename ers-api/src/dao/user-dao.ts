import { connectionPool } from "../util/connection-util";
import { Reimbursement } from "../model/Reimbursement";
import { User } from "../model/user";
import { SqlUser } from "../dto/sql_user"
import { reimbursementConverter } from "../util/reimbursement-converter";
import { userConverter } from "../util/user-converter";

/**
 * Retrieve all users from the DB along with all their reimbursements
 */
export async function findAll(): Promise<User[]> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(
      `SELECT * FROM ers.ers_users u
      LEFT JOIN ers.ers_reimbursement r
      ON u.ers_users_id = r.reimb_author
      LEFT JOIN ers.ers_reimbursement_status rs
      USING(reimb_status_id)
      LEFT JOIN ers.ers_reimbursement_type
      USING(reimb_type_id)
      ORDER BY u.user_last_name`)


    // extract the users and their reimbursements from the result set
    const users = [];
    resp.rows.forEach((user_reimbursement_result) => {
      const reimbursement = reimbursementConverter(user_reimbursement_result, user_reimbursement_result);
      const exists = users.some( existingUser => {
        if(user_reimbursement_result.ers_users_id === existingUser.id) {
          reimbursement.id && existingUser.reimbursements.push(reimbursement);
          return true;
        }
      })
      if (!exists) {
        const newUser = userConverter(user_reimbursement_result);
        reimbursement.id && newUser.reimbursements.push(reimbursement);
        users.push(newUser);
      }
    })
    return users;
  } finally {
    client.release();
  }
}


/**
 * Retreive a single user by username and password, will also retreive all of that users reimbursements
 * @param id 
 */
export async function findByUsernameAndPassword(username: string, password: string): Promise<User> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(
      `SELECT * FROM ers.ers_users u
      LEFT JOIN ers.ers_reimbursement r
      ON r.reimb_resolver = u.ers_users_id
      WHERE u.ers_username = $1 AND u.ers_password = $2
      ORDER BY u.user_last_name`, [username, password]);
      if(resp.rows.length !== 0) {
        const user = userConverter(resp.rows[0]); // get the user data from first row

        // get the movies from all the rows
        resp.rows.forEach((reimbursement) => {
          reimbursement.id && user.reimbursements.push(reimbursementConverter(reimbursement, reimbursement));
        })
        return user;
      }
      return null;
  } finally {
    client.release();
  }
}


/**
 * Add a new user to the DB
 * @param user 
 */
export async function create(user: SqlUser): Promise<number> {
  const client = await connectionPool.connect();
  try {
    const resp = await client.query(
      `INSERT INTO ers.ers_users
        (ers_username, ers_password, user_first_name, user_last_name, user_email, user_role_id)
        VALUES ($1, $2, $3, $4, $5, 1) 
        RETURNING ers_users_id`, 
        [user.ers_username, user.ers_password ,
        user.user_first_name, user.user_last_name, user.user_email]);
    return resp.rows[0].ers_user_id;
  } finally {
    client.release();
  }
}



