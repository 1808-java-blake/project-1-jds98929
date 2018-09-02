function openTab(evt, tabName) {

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
  evt.currentTarget.className += " active";
}

function manageAll(e){
  e.preventDefault();
  fetch(`http://localhost:9001/users`, {
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
      const employees = JSON.stringify(resp);
      localStorage.setItem('employees', employees);
      window.location = 'http://localhost:9001/manager-view-all/manager-view-all.html';
    })
    .catch(err => {
      console.log(err);
    });
      
}

function manageEmployee(e) {
  e.preventDefault();
  const statusId = document.getElementById('r_scope').value;
  const firstName = document.getElementById('input-first-name').value;
  const lastName = document.getElementById('input-last-name').value;

  if (statusId !== '0'){
    const parameters = {statusId, firstName, lastName}
    fetch(`http://localhost:9001/reimbursement/name`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        parameters: 'include',
        body: JSON.stringify(parameters)
      }).then(resp => {
        if (resp.status === 401) {
          alert('Unauthenticated: session expired');
        } else if (resp.status === 200) {
          return resp.json();
        } else {
          alert('Failed to retrieve reimbursements');
        }
      })
      .then(resp => {
        const reimbursements = JSON.stringify(resp);
        localStorage.setItem('reimbursements', reimbursements);
        window.location = 'http://localhost:9001/manager-view/manager-view.html';
      })
      .catch(err => {
        console.log(err);
      });
    
  } else {
    const parameters = {firstName, lastName}
    fetch(`http://localhost:9001/reimbursement/name-all`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        parameters: 'include', 
        body: JSON.stringify(parameters)
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
        window.location = 'http://localhost:9001/manager-view/manager-view.html';
      })
      .catch(err => {
        console.log(err);
      });

  }
    
}

function manageID(e) {
  e.preventDefault();
  const id = document.getElementById('input-id').value;
  fetch(`http://localhost:9001/reimbursement/${id}`, {
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
      window.location = 'http://localhost:9001/manager-view/manager-view.html';
    })
    .catch(err => {
      console.log(err);
    });
}