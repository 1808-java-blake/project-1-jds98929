import { SqlReimbursement } from "../dto/sql_reimbursement";
import { Reimbursement } from "../model/Reimbursement";
import { SqlUser } from "../dto/sql_user";

/**
 * This is used to convert a sql reimbursement into an actual reimbursement
 */
export function reimbursementConverter(reimbursement: SqlReimbursement, user: SqlUser) {
  let status: string = '';
  let type: string = '';
  let submitted = '';
  let resolved = '';

  const submittedDate: Date = new Date(reimbursement.reimb_submitted);
  submitted = submittedDate.toLocaleString('en-US');
  
  if (reimbursement.reimb_resolved) {
    const resolvedDate: Date = new Date(reimbursement.reimb_resolved);
    resolved = resolvedDate.toLocaleString('en-US');
  }

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

  return new Reimbursement(reimbursement.reimb_id, reimbursement.reimb_amount, submitted, resolved,
    reimbursement.reimb_description, reimbursement.reimb_receipt, `${user.user_first_name} ${user.user_last_name}`, reimbursement.reimb_resolver,
    status, type);
}