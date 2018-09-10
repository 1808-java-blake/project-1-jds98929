import * as React from 'react';

interface IState {
    reimbursements: any,
    update: {
      reimb_id: number,
      reimb_resolver: number,
      reimb_status_id: number,
    }
}

/**
 * Manager's table for viewing reimbursements
 */
export class ManagerReimbursementViewComponent extends React.Component<any, IState> {
    public constructor(props: any) {
      super(props);
      this.state = {
          reimbursements: [{}],
          update: {
            reimb_id: 0,
            reimb_resolver: 0,
            reimb_status_id: 0,
          }
      }
    }

    /**
     * gets reimursements and manager ID from local storage
     */
    public componentDidMount(){
        const arr: any = localStorage.getItem('reimbursements');
        const reimb = JSON.parse(arr);
        reimb.forEach((obj: any) => {
          this.setState({
            ...this.state,
            reimbursements: this.state.reimbursements.push(obj)
          })
        })
        const manager: any = localStorage.getItem('user');
        this.setState({
            ...this.state,
            update: {
                ...this.state.update,
                reimb_resolver: +JSON.parse(manager).id
            } 
        })
    }

    public statusChange = (event: any) => {
        event.preventDefault();
        this.setState({
            ...this.state,
            update: {
                ...this.state.update,
                reimb_status_id: event.target.value
            }
        })
    }

    /**
     * sets id of pending reimbursement to be updated and completes the update upon callback.
     */
    public resolve = (event: any) => {
        event.preventDefault();
        this.setState({
            ...this.state,
            update: {
                ...this.state.update,
                reimb_id: event.target.id
            }
                
        }, this.resolveFetch);
    }

    /**
     * Resolves the chosen pending reimbursement
     */
    public resolveFetch = () => {
        const update = this.state.update;
        fetch(`http://localhost:9001/reimbursement/${update.reimb_id}`, {
          body: JSON.stringify(update),
          credentials: 'include',
          headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
          },
          method: 'POST'


        }).then(resp => {
          if (resp.status === 401) {
            alert('Unauthenticated: session expired');
            return
          }else if (resp.status === 200) {
            alert('Reimbursement resolved');
            return resp.json();
          } else {
            alert('Failed to retrieve reimbursements');
            return
          }
        })
        .then(resp => {
           this.props.history.push('/manager-home');
        })
        .catch(err => {
          console.log(err);
        });

    }

    /**
     * Returns a resolve form if pending and an empty string otherwise
     */
    public resolveForm = (reimbId: any, status: string) => {
      if (status === 'Pending') {
        return (<div><select onChange={this.statusChange} className="form-control col-xs-18 col-sm-16 col-md-14 col-lg-12">
        <option value="0">Select status</option>
        <option value="2">Approve</option>
        <option value="3">Deny</option>
        </select>
        <button onClick={this.resolve} id={reimbId} className="btn btn-sm btn-primary btn-block submit-button" type="submit">Resolve</button></div>)
      }
      else {
        return ('');
      }
    }

    public render() {
      const reimbursements = this.state.reimbursements;
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
              <th scope="col">Resolve</th>
            </tr>
          </thead>
          <tbody id="reimbursement-table-body">
          {reimbursements.map((reimbursement: any) => (reimbursement.id &&
                  <tr key={reimbursement.id}>
                    <td>{reimbursement.amount}</td>
                    <td>{reimbursement.submitted}</td>
                    <td>{reimbursement.resolved}</td>
                    <td>{reimbursement.description}</td>
                    <td>{reimbursement.author}</td>
                    <td>{reimbursement.resolver === 0 ? '' : reimbursement.resolver}</td>
                    <td>{reimbursement.status}</td>
                    <td>{reimbursement.type}</td>
                    <td> {this.resolveForm(reimbursement.id, reimbursement.status)}
                    </td>
                  </tr>
            ))
          }
          </tbody>
        </table>
      );
    }
}
    
    

   