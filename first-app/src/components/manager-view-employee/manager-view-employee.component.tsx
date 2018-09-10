import * as React from 'react';
import { RouteComponentProps } from 'react-router';

/**
 * Manager's table of employees
 */
export class ManagerViewEmployeeComponent extends React.Component<RouteComponentProps<{}>, any> {

  public constructor(props: any) {
    super(props);
    this.state = {
      errorMessage: '',
      status: 'none'
    }
  }

  public statusChange = (event:any) => {
    this.setState({
      ...this.state,
      status: event.target.value
    })
  }


  /**
   * Retrieves reimbursements of chosen employee and navigates to manager's reimbursement table
   */
  public view = (event: any) => {
    event.preventDefault();
    const employeeId = event.target.id;
    const status = this.state.status;
    if (status === 'none'){
      this.setState({
        ...this.state,
        errorMessage: 'Please select a status'
      })
      return;
    }
    fetch(`http://localhost:9001/reimbursement/${status}/${employeeId}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET'
    }).then(resp => {
      if (resp.status === 401) {
        this.setState({
          ...this.state,
          errorMessage: 'Unauthorized'
        })
      } else if (resp.status === 200) {
        return resp.json();
      } else {
        this.setState({
          ...this.state,
          errorMessage: 'Failed to retrieve reimbursements at this time'
        })
      } throw new Error('Failed to retrieve reimbursements')
    })
    .then(resp => {
      const reimbursements = JSON.stringify(resp);
      localStorage.setItem('reimbursements', reimbursements);
      this.props.history.push('/manager-reimbursement-view');
    })
    .catch(err => {
      console.log(err);
    });

  }

  public render() {
    const emps:any = localStorage.getItem('employees');
    const employees = JSON.parse(emps);
    return (
      <div>
      <table className="table table-striped table-dark col" id="reimbursement-table">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">First name</th>
            <th scope="col">Last name</th>
            <th scope="col">E-mail</th>
            <th scope="col">Reimbursements</th>
          </tr>
        </thead>
        <tbody id="reimbursement-table-body">
        { employees.map((employee: any, index: number) => (employee.id && employee.roleId === 1 &&
                <tr key={employee.id}>
                  <td>{employee.username}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>
                    <select onChange={this.statusChange} className="form-control col-xs-18 col-sm-16 col-md-14 col-lg-12">
                      <option value="none">Select status</option>
                      <option value="all">View All</option>
                      <option value="pending">View Pending</option>
                      <option value="approved">View Approved</option>
                      <option value="denied">View Denied</option>
                    </select>
                    <button id={employee.id} onClick={this.view} className="btn btn-md btn-primary btn-block">
                    View Reimbursements
                    </button>
                  </td>
                </tr>
          ))
        }
        </tbody>

      </table>
      <p className="red">{this.state.errorMessage}</p>
      </div>
    );
  }
}

