export class Reimbursement {
  id = 0;
  amount = 0;
  submitted = '';
  resolved = '';
  description = '';
  receipt = {};
  author = 0;
  resolver = 0;
  status = '';
  type = '';

  constructor(id?: number, amount?: number, submitted?: string, resolved?: string, 
    description?: string, receipt?: object, author?: number, resolver?: number, status?: string, type?: string) {
    id && (this.id = id);
    amount && (this.amount = amount);
    submitted && (this.submitted = submitted);
    resolved && (this.resolved = resolved);
    description && (this.description = description);
    receipt && (this.receipt = receipt);
    author && (this.author = author);
    resolver && (this.resolver = resolver);
    status && (this.status = status);
    type && (this.type = type);
  }
}