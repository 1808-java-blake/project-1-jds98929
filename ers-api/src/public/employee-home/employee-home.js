let welcome = document.getElementById('welcome');
const userString = localStorage.getItem('user');
const user = JSON.parse(userString);
welcome.innerText += ` ${user.firstName}!`;

function openTab(e, tabName) {

  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  e.currentTarget.className += " active";
}

function view(event) {
  event.preventDefault();
  const scopes = document.getElementById('reimb-scope');
  const scope = scopes.options[ scopes.selectedIndex ].value;
  const user = localStorage.getItem('user');
  const id = JSON.parse(user).id;

  switch (scope) {
    case ('all'):
      getAll(id);
      break;
    case ('pending') :
      getReimbursements(scope,id);
      break;
    case ('approved') :
      getReimbursements(scope,id);
      break;
    case ('denied') :
      getReimbursements(scope,id);
      break;
    default:
      break;
  }
}

function getReimbursements(status,authorId){
  fetch(`http://localhost:9001/reimbursement/${status}/${authorId}`, {
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
      const reimbursements = JSON.stringify(resp);
      localStorage.setItem('reimbursements', reimbursements);
      window.location = 'http://localhost:9001/employee-view/employee-view.html';
    })
    .catch(err => {
      console.log(err);
    });
      
}

function getAll(authorId) {
  fetch(`http://localhost:9001/reimbursement/all/${authorId}`, {
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
      const reimbursements = JSON.stringify(resp);
      localStorage.setItem('reimbursements', reimbursements);
      window.location = 'http://localhost:9001/employee-view/employee-view.html';
    })
    .catch(err => {
      console.log(err);
    });
      
}

function createReimbursement(event) {
  event.preventDefault();

  const amount = document.getElementById('input-amount').value;
  const description = document.getElementById('input-description').value;
  const user = localStorage.getItem('user');
  const id = JSON.parse(user).id;
  
  const types = document.getElementById('input-type');
  const type = types.options[ types.selectedIndex ].value;
  let typeId;
  switch (type){
    case ('Lodging') :
      typeId = 1;
      break;
    case('Travel') :
      typeId = 2;
      break;
    case ('Food') :
      typeId = 3;
      break;
    case('Other') :
      typeId = 4;
      break;
  }
  
  const reimbursement = {
    reimb_amount: amount,
    reimb_description: description,
    reimb_author: id,
    reimb_status_id: 1,
    reimb_type_id: typeId
  }

  fetch('http://localhost:9001/reimbursement', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reimbursement)
  })
  .then(resp => resp.json())
  .then(resp => {
    window.location = 'http://localhost:9001/employee-home/employee-home.html';
  })
  .catch(err => {
    console.log(err);
  });
}