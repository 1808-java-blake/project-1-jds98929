import { Reimbursement } from "./Reimbursement";

export class User {
  id = 0;
  username = '';
  password = '';
  firstName = '';
  lastName = '';
  email = '';
  roleId = 0;
  reimbursements: Reimbursement[] = [];

  constructor(id?: number, username?: string, password?: string, firstName?: string, lastName?: string,
  email?: string, roleId?: number, reimbursements?: any) {
    id && (this.id = id);
    username && (this.username = username);
    password && (this.password = password);
    firstName && (this.firstName = firstName);
    lastName && (this.lastName = lastName);
    email && (this.email = email);
    roleId && (this.roleId = roleId);
    reimbursements && (this.reimbursements = reimbursements);
  }
}