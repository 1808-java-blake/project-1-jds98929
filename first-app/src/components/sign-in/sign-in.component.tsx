import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface IState {
  credentials: {
    password: string,
    username: string,
  },
  errorMessage: string
}

/**
 * Sign in component
 */
export class SignInComponent extends React.Component<RouteComponentProps<{}>, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
      credentials: {
        password: '',
        username: '',
      },
      errorMessage: ''
    }
  }

  public passwordChange = (e: any) => {
    this.setState({
      ...this.state,
      credentials: {
        ...this.state.credentials,
        password: e.target.value
      }
    });
  }

  public usernameChange = (e: any) => {
    this.setState({
      ...this.state,
      credentials: {
        ...this.state.credentials,
        username: e.target.value
      }
    });
  }

  public submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('http://localhost:9001/users/login', {
      body: JSON.stringify(this.state.credentials),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST', 
    })
      .then(resp => {
        if (resp.status === 401) {
          this.setState({
            ...this.state,
            errorMessage: 'Invalid Credentials'
          });
        } else if (resp.status === 200) {
          return resp.json();
        } else {
          this.setState({
            ...this.state,
            errorMessage: 'Failed to Login at this time'
          });
        }
        throw new Error('Failed to login');
      })
      .then(resp => {
        localStorage.setItem('user', JSON.stringify(resp));
        const user: any = JSON.parse(JSON.stringify(resp));
        if (user.roleId === 1) {
          this.props.history.push('/employee-home');
        } if (user.roleId === 2) {
          this.props.history.push('/manager-home')
        }
      })
      .catch(err => {
        console.log(err);
      });
  }


  public render() {
    const { errorMessage, credentials } = this.state;

    return (
      <form className="form-signin" onSubmit={this.submit}>
        <h3 className="navy mb-3 font-weight-normal row justify-content-center">Please sign in</h3>

        <label htmlFor="inputUsername" className="sr-only">Username</label>
        <input
          onChange={this.usernameChange}
          value={credentials.username}
          type="text"
          id="inputUsername"
          className="form-control"
          placeholder="Username"
          required />

        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input
          onChange={this.passwordChange}
          value={credentials.password}
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Password"
          required />

        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        {errorMessage && <p className="red" id="error-message">{errorMessage}</p>}
      </form>
    );
  }
}

