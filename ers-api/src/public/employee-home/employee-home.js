function view(event) {
  event.preventDefault();
  let scopes = document.getElementById('reimb-scope');
  let scope = scopes.options[ scopes.selectedIndex ].value;
  let user = localStorage.getItem('user');
  let id = JSON.parse(user).id;
  localStorage.setItem('user', user);
  console.log(id);
  console.log(scope);

  switch (scope) {
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
          document.getElementById('error-message').innerText = 'Unauthenticated: session expired';
        }if (resp.status === 200) {
          return resp.json();
          document.getElementById('error-message').innerText = '';
        } else {
          document.getElementById('error-message').innerText = 'Failed to retrieve reimbursements';
        }
      })
      .then(resp => {
        let ins = document.getElementById('results');
        ins.innerHTML = JSON.parse(JSON.stringify(resp));
      })
      .catch(err => {
        console.log(err);
      });
      
  }