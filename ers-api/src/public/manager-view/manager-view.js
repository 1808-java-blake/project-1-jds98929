const arr = localStorage.getItem('reimbursements');
const manager = localStorage.getItem('user');
const reimbursements = JSON.parse(arr);
const body = document.getElementById('reimbursement-table-body');
let resolveButtons, resolver;

if(!reimbursements[0]){
  if (reimbursements.status === 'Pending') {
    resolveButtons = `<th scope="col">
    <button id="Approve" onclick="resolve(event)" value="${reimbursements.id}"
    class="btn btn-primary btn-block submit-button">
    Approve</button></th>
    <th scope="col">
    <button id="Deny" onclick="resolve(event)" value="${reimbursements.id}" 
    class="btn btn-primary btn-block submit-button">
    Deny</button></th>
    </tr>`;
  } else {
    resolveButtons = '</tr>'
  }
  if (reimbursements.resolver == 0) {
    resolver = '';
  } else {
    resolver = reimbursements.resolver;
  }
  if (reimbursements.id) {
    body.innerHTML += 
    ` <tr>
    <th scope="col">${reimbursements.id}</th>
    <th scope="col">${reimbursements.amount}</th>
    <th scope="col">${reimbursements.submitted}</th>
    <th scope="col">${reimbursements.resolved}</th>
    <th scope="col">${reimbursements.description}</th>
    <th scope="col">${reimbursements.author}</th>
    <th scope="col">${resolver}</th>
    <th scope="col">${reimbursements.status}</th>
    <th scope="col">${reimbursements.type}</th>
    ${resolveButtons}`
  }
} else{

  for(let i = 0; i < reimbursements.length; i++){
    if (reimbursements[i].resolver == 0) {
      resolver = '';
    } else {
      resolver = reimbursements[i].resolver;
    }
    if (reimbursements[i].status === 'Pending') {
        resolveButtons = `<th scope="col">
        <button id="Approve" onclick="resolve(event)" value="${reimbursements[i].id}"
        class="btn btn-primary btn-block submit-button">
        Approve</button></th>
        <th scope="col">
        <button id="Deny" onclick="resolve(event)" value="${reimbursements[i].id}" 
        class="btn btn-primary btn-block submit-button">
        Deny</button></th>
        </tr>`;
    } else {
        resolveButtons = '</tr>'
    }
    if (reimbursements[i].id !== 0){
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
        ${resolveButtons}`
    }
  }
}

function resolve(e){
    e.preventDefault();
    const status =  event.target.id;
    let reimb_status_id;
    switch (status){
      case ('Approve') :
        reimb_status_id = 2
        break;
      case ('Deny') :
        reimb_status_id = 3
        break;
      default:
        reimb_status_id = 0;
        break;
    }
    const reimb_id = event.target.value;
    const reimb_resolver = +JSON.parse(manager).id;
    const parameters = {reimb_resolver, reimb_status_id, reimb_id};
    fetch(`http://localhost:9001/reimbursement/${reimb_id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      parameters: 'include',
      body: JSON.stringify(parameters)
    }).then(resp => {
      if (resp.status === 401) {
        alert('Unauthenticated: session expired');
      }else if (resp.status === 200) {
        return resp.json();
      } else {
        alert('Failed to retrieve reimbursements');
      }
    })
    .then(resp => {
      window.location = 'http://localhost:9001/manager-home/manager-home.html';
    })
    .catch(err => {
      console.log(err);
    });
}