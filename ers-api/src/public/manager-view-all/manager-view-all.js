const arr = localStorage.getItem('employees');
const manager = localStorage.getItem('user');
const employees = JSON.parse(arr);
const body = document.getElementById('employees-table-body');
let viewButton;

for(let i = 0; i < employees.length; i++){
    if (employees[i].roleId === 1) {
        viewButton = 
        `<button onclick="view(event)" id="${employees[i].id}"
        class="btn btn-primary btn-block submit-button">
        View</button>`;

        body.innerHTML += 
        ` <tr>
            <th scope="col">${employees[i].id}</th>
            <th scope="col">${employees[i].username}</th>
            <th scope="col">${employees[i].password}</th>
            <th scope="col">${employees[i].firstName}</th>
            <th scope="col">${employees[i].lastName}</th>
            <th scope="col">${employees[i].email}</th>
            <th scope="col">${employees[i].roleId}</th>
            <th scope="col">${viewButton}</th>
        </tr>`
    }
}

function view(e){
    e.preventDefault();
    const id =  event.target.id;
    fetch(`http://localhost:9001/reimbursement/all/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(resp => {
      if (resp.status === 401) {
        alert('Unauthenticated: session expired');
      }if (resp.status === 200) {
        return resp.json();
      } else {
        alert('Failed to retrieve reimbursements');
      }
    })
    .then(resp => {
      localStorage.setItem('reimbursements', JSON.stringify(resp));  
      window.location = 'http://localhost:9001/manager-view/manager-view.html';
    })
    .catch(err => {
      console.log(err);
    });
}