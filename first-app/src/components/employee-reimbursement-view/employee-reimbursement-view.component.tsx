import * as React from 'react';

/**
 * Table of current user's reimbursements
 */
export class EmployeeReimbursementViewComponent extends React.Component<any, any> {

  public render() {
    const reimb: any = localStorage.getItem('reimbursements');
    const reimbursements = JSON.parse(reimb);
    return (
      <table className="table table-striped table-dark col" id="reimbursement-table">
        <thead>
          <tr>
            <th scope="col">Amount</th>
            <th scope="col">Submitted</th>
            <th scope="col">Resolved</th>
            <th scope="col">Description</th>
            <th scope="col">Author</th>
            <th scope="col">Resolver</th>
            <th scope="col">Status</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody id="reimbursement-table-body">
          {
            reimbursements.map((reimbursement: any) => (
              <tr key={reimbursement.id}>
                <td>{reimbursement.amount}</td>
                <td>{reimbursement.submitted}</td>
                <td>{reimbursement.resolved}</td>
                <td>{reimbursement.description}</td>
                <td>{reimbursement.author}</td>
                <td>{reimbursement.resolver === 0 ? '' : reimbursement.resolver}</td>
                <td>{reimbursement.status}</td>
                <td>{reimbursement.type}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}

