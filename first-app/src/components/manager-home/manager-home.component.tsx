import * as React from 'react';
import { RouteComponentProps } from 'react-router';

/**
 * Manager home component
 */
export class ManagerHomeComponent extends React.Component<RouteComponentProps<{}>, any> {

  public constructor(props: any) {
    super(props);
    this.state = {
      errorMessage: '',
      statusId: 'none'
    }
  }

  public statusChange = (event: any) => {
    event.preventDefault();
    this.setState({
      ...this.state,
      statusId: event.target.value
    })
  }

  /**
   * Retrieves reimbursements based on status and navigates to manager's reimbursement table
   */
  public view = (event: any) => {
    event.preventDefault();
    const statusId = this.state.statusId;
    if (statusId === 'none'){
      this.setState({
        ...this.state,
        errorMessage: 'Please select a status'
      })
    } else if (statusId === 'all'){
      fetch(`http://localhost:9001/reimbursement`, {
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
    } else {
      fetch(`http://localhost:9001/reimbursement/status/${statusId}`, {
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

  }

  /**
   * Retrieves list of employees and navigates to manager's employee table.
   */
  public viewEmp = (event: any) => {
    event.preventDefault();
    fetch('http://localhost:9001/users', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET'
    }) .then(resp => {
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
    }).then(resp => {
      const employees = JSON.stringify(resp);
      localStorage.setItem('employees', employees);
      this.props.history.push('/manager-view-employees')
    })
    .catch(err => {
      console.log(err);
    });
  }

  public render() {
    return (
      <form className="form-sign-in col-xs-12 col-sm-10 col-md-8 col-lg-6">
        <h3 className="navy mb-3 font-weight-normal row justify-content-center">
        Manage reimbursements below
        </h3>
        <select onChange={this.statusChange} className="form-control col-xs-18 col-sm-16 col-md-14 col-lg-12">
          <option value="none">Select a status</option>
          <option value="all">View All</option>
          <option value="1">View Pending</option>
          <option value="2">View Approved</option>
          <option value="3">View Denied</option>
        </select>
        <button onClick={this.view} className="btn btn-lg btn-primary btn-block">View by Status</button>
        <br/>
        <button onClick={this.viewEmp} className="btn btn-lg btn-primary btn-block">View by Employee</button>
        <br/>
        <p className="red"> {this.state.errorMessage} </p>
      </form>
      

    );
  }
}


