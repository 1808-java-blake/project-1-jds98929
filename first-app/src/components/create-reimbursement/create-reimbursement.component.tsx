import * as React from 'react';
import { RouteComponentProps } from 'react-router';

/**
 * Create reimbursement component
 */
export class CreateReimbursementComponent extends React.Component<RouteComponentProps<{}>, any> {

    constructor(props: any) {
        super(props);
        const user: any = localStorage.getItem('user');
        const id: number = +JSON.parse(user).id;
        this.state = {
            errorMessage: '',
            reimbursement: {
              reimb_amount: '',
              reimb_author: id,
              reimb_description: '',
              reimb_status_id: 1,
              reimb_type_id: 0
          }
        }
      }

      public amountChange = (event: any) => {
        this.setState({
          ...this.state,
          reimbursement: {
            ...this.state.reimbursement,
            reimb_amount: event.target.value
          }
        });

      }

      public typeChange = (event: any) => {
        this.setState({
          ...this.state,
          reimbursement: {
            ...this.state.reimbursement,
            reimb_type_id: +event.target.value
          }
        });
      }

      public descriptionChange = (event: any) => {
        this.setState({
          ...this.state,
          reimbursement: {
            ...this.state.reimbursement,
            reimb_description: event.target.value
          }
        });
      }

      /**
       * Adds the new reimbursement to the database, handles any errors and navigates home.
       */
      public createReimbursement = (event: React.FormEvent<HTMLFormElement>) =>{
          event.preventDefault();
          if (this.state.reimb_type_id === 0){
            this.setState({
              ...this.state,
              errorMessage: 'Please select a type'
            });
          }
          fetch('http://localhost:9001/reimbursement', {
              body: JSON.stringify(this.state.reimbursement),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST'
          }).then(resp=> {
            if (resp.status === 401) {
                this.setState({
                  ...this.state,
                  errorMessage: 'Invalid Credentials'
                });
              } else if (resp.status === 201) {
                alert('Reimbursement created successfully')
                return resp.json();
              } else {
                this.setState({
                  ...this.state,
                  errorMessage: 'Failed to create reimbursement'
                });
              }
              throw new Error('Failed to create reimbursement');
            })
            .then(resp => {
                this.props.history.push('/employee-home')
            })
            .catch(err => {
              console.log(err);
            });
    
      }


    public render(){
        return(
            <form className="form-sign-in col-xs-12 col-sm-10 col-md-8 col-lg-6" onSubmit={this.createReimbursement}>
                  <h1 className="h3 mb-3 font-weight-normal row justify-content-center">Enter Info</h1>
                  <label htmlFor="input-title" className="sr-only">Amount</label>
                  <input onChange={this.amountChange} type="text" id="input-amount" className="form-control" placeholder="Amount" />
                  <br/>
          
                  <label htmlFor="input-type" className="sr-only">Type</label>
                  <select id="input-type" onChange={this.typeChange}className="form-control">
                    <option value="0">Select type</option>
                    <option value="1">Lodging</option>
                    <option value="2">Travel</option>
                    <option value="3">Food</option>
                    <option value="4">Other</option>
                  </select>
                  <br/>
          
                  <label htmlFor="description" className="sr-only">Desription</label>
                  <input onChange={this.descriptionChange} type="text" id="input-description" className="form-control" placeholder="Description" />
                  <br/>
                  <button className="btn btn-lg btn-primary btn-block submit-button" type="submit">Submit</button>
                  <br/>
                  <p className="red">{this.state.errorMessage}</p>
            </form>
        )
    }
}