import * as React from 'react';
import { RouteComponentProps } from 'react-router';

/**
 * Employee home component
 */
export class EmployeeHomeComponent extends React.Component<RouteComponentProps<{}>, any> {

  public constructor(props: any){
    super(props);
    this.state = {
      employeeFirstName: '',
      employeeId: 0,
      errorMessage: '',
      status: 'none'
    }
  }

  /**
   * Gets the ID and first name (for greeting) of the current user
   */
  public componentDidMount(){
    const emp: any = localStorage.getItem('user');
    const employee = JSON.parse(emp);
    this.setState({
      ...this.state,
      employeeFirstName: employee.firstName,
      employeeId: employee.id
    })
  }

  public statusChange = (event:any) => {
    this.setState({
      ...this.state,
      status : event.target.value
    })
  }

  /**
   * Navigates to the create reimbursement page when the corresponding button is clicked
   */
  public create = (event: any) => {
    event.preventDefault();
    this.props.history.push('/create-reimbursement')
  }  

  /**
   * Retrieves the user's reimbursements based on the status provided,
   * navigates to the reimbursement table
   */
  public view = (event: any) => {
    event.preventDefault();
    if (this.state.status === 'none'){
      this.setState({
        ...this.state,
        errorMessage: 'Please select a status'
      });
      return;
    }
    const status = this.state.status;
    const employeeId = this.state.employeeId;
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
      this.props.history.push('/employee-reimbursement-view')
    })
    .catch(err => {
      console.log(err);
    });

    
  }

  public render() {
    return (
      <div className="rows">
      <h3 className="navy mb-3 font-weight-normal row justify-content-center">
       Welcome, {this.state.employeeFirstName}!
      </h3>
      <h6 className="navy mb-6 font-weight-normal row justify-content-center"> 
      You can view your reimbursements below or create a new one. 
      </h6>
      <br/>
      <form className="form-sign-in col-xs-18 col-sm-16 col-md-14 col-lg-12">
        <select onChange={this.statusChange} className="form-control col-xs-18 col-sm-16 col-md-14 col-lg-12">
          <option value="none">Select status</option>
          <option value="all">View All</option>
          <option value="pending">View Pending</option>
          <option value="approved">View Approved</option>
          <option value="denied">View Denied</option>
        </select>
        <button className="btn btn-lg btn-primary btn-block submit-button" onClick={this.view} type="submit">View Reimbursements</button>
        <br/>
        <button className="btn btn-lg btn-primary btn-block submit-button" onClick={this.create} type="submit">Create Reimbursement</button>
        <br/>
        <p className="red">{this.state.errorMessage}</p>
      </form>
      </div>
    );
  }
}

