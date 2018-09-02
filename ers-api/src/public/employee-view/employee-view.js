const arr = localStorage.getItem('reimbursements');
const reimbursements = JSON.parse(arr);
const body = document.getElementById('reimbursement-table-body');
let resolver;

for(let i = 0; i < reimbursements.length; i++){
    if (reimbursements[i].resolver == 0) {
        resolver = '';
    } else {
        resolver = reimbursements[i].resolver;
    }
    body.innerHTML += 
    ` <tr>
        <th scope="col">${reimbursements[i].id}</th>
        <th scope="col">${reimbursements[i].amount}</th>
        <th scope="col">${reimbursements[i].submitted}</th>
        <th scope="col">${reimbursements[i].resolved}</th>
        <th scope="col">${reimbursements[i].description}</th>
        <th scope="col">${reimbursements[i].author}</th>
        <th scope="col">${resolver}</th>
        <th scope="col">${reimbursements[i].status}</th>
        <th scope="col">${reimbursements[i].type}</th>
    </tr>`
}

