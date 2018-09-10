import * as React from 'react';
import './App.css';
import './include/bootstrap';
import { AppNav } from './components/nav/nav.component';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { EmployeeHomeComponent } from './components/employee-home/employee-home.component';
import { ManagerHomeComponent } from './components/manager-home/manager-home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { EmployeeReimbursementViewComponent } from './components/employee-reimbursement-view/employee-reimbursement-view.component';
import { CreateReimbursementComponent } from './components/create-reimbursement/create-reimbursement.component';
import { ManagerReimbursementViewComponent } from './components/manager-reimbursement-view/manager-reimbursement-view.component';
import { ManagerViewEmployeeComponent } from './components/manager-view-employee/manager-view-employee.component';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div>
          <AppNav />
          <div id="main-content-container">
            <Switch>
              <Route path="/sign-in" component={SignInComponent} />
              <Route path="/employee-home" component={EmployeeHomeComponent} />
              <Route path="/manager-home" component={ManagerHomeComponent} />
              <Route path="/employee-reimbursement-view" component={EmployeeReimbursementViewComponent} />
              <Route path="/create-reimbursement" component={CreateReimbursementComponent} />
              <Route path="/manager-reimbursement-view" component={ManagerReimbursementViewComponent}/>
              <Route path="/manager-view-employees" component={ManagerViewEmployeeComponent}/>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
