import * as React from 'react';
import { Link } from 'react-router-dom';
import ErsLogo from '../../assets/ers-logo.png';

/**
 * Nav bar
 */
export class AppNav extends React.Component<any, any> {

  public constructor (props: any) {
    super(props);
    this.state = {
      home: '/sign-in',
      loginToggle: 'Sign in',
      user: ''
    }
  }

  /**
   * Checks current user every 100 ms 
   * If user is an employee, home is employee home
   * If manager, home is manager home.  Otherwise, home is the sign in component
   * If no user is logged in, a sign in button is displayed.
   * If a user is logged in, a log out button is displayed.
   */
  public componentDidMount(){
    setInterval(() => { 
      let u: any = '';
      try {
        if (window.location.href === 'http://localhost:3000/sign-in'){
          localStorage.setItem('user', '');
          this.setState({
            ...this.state,
            home: '/sign-in',
            loginToggle: 'Sign in',
            user: ''
          })
        } else {
          u = localStorage.getItem('user');
          const currentUser = JSON.parse(u);
          if (u !== ''){
            this.setState({
              ...this.state,
              loginToggle: 'Logout',
              user: u
            })
            if (currentUser.roleId === 1){
              this.setState({
                ...this.state,
                home: '/employee-home'
              })
            } else if (currentUser.roleId === 2) {
              this.setState({
                ...this.state,
                home: '/manager-home'
              })
            } else {
              this.setState({
                ...this.state,
                home: '/sign_in'
              })
            }
          }
        } 
      } catch (error) {
        localStorage.setItem('user', '');
        this.setState({
          ...this.state,
          home: '/sign-in',
          loginToggle: 'Sign in',
          user: ''
        })}
    }, 100);
  }


  public render(){
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-expand-lg navbar-light bg-light display-front nav-pad">
          <div className="navbar-header c-pointer shift-left">
          <Link to={this.state.home} className="unset-anchor nav-link">
            <img className="img-adjust-position ers-logo" src={ErsLogo} alt="revature" />
          </Link>
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExample04">
            <ul className="navbar-nav ml-auto margin-nav">
              <li className="nav-item active">
                <Link to={this.state.home} className="unset-anchor nav-link">Home</Link>
              </li>
              <li className="nav-item active">
                <Link to="/sign-in" className="unset-anchor nav-link">{this.state.loginToggle}</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div >
    );
  }
}