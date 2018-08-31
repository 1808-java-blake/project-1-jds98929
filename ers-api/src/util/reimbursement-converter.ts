import { SqlReimbursement } from "../dto/sql_reimbursement";
import { Reimbursement } from "../model/Reimbursement";

/**
 * This is used to convert a sql movie into an actual movie
 */
export function reimbursementConverter(reimbursement: SqlReimbursement) {
  let status = '';
  let type = '';

  switch (reimbursement.reimb_status_id){
    case 1: 
      status = 'Pending';
      break;
    case 2:
      status = 'Approved';
      break;
    case 3:
      status = 'Denied';
      break;
  }

  switch (reimbursement.reimb_type_id){
    case 1:
      type = 'Lodging'
      break; 
    case 2:
      type = 'Travel';
      break;
    case 3:
      type = 'Food';
      break;
    case 4:
      type = 'Other';
      break;
  }

  return new Reimbursement(reimbursement.reimb_id, reimbursement.reimb_amount, reimbursement.reimb_submitted, reimbursement.reimb_resolved,
    reimbursement.reimb_description, reimbursement.reimb_receipt, reimbursement.reimb_author, reimbursement.reimb_resolver,
    status, type);
}