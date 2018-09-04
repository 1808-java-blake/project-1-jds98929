function registerEmployee(e){
    e.preventDefault();
    const ers_username = document.getElementById('input-username').value;
    const ers_password = document.getElementById('input-password').value;
    const user_first_name = document.getElementById('input-first-name').value;
    const user_last_name = document.getElementById('input-last-name').value;
    const user_email = document.getElementById('input-email').value;

    const employee = {ers_username, ers_password, user_first_name, user_last_name, user_email};
    fetch('http://localhost:9001/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        employee: 'include',
        body: JSON.stringify(employee)
      }).then(resp => {
        if (resp.status === 201) {
          alert('Registration successful!');
          window.location = 'http://localhost:9001/login-page/login.html';
        } else {
          alert('Failed to create user');
        }
      })
      .catch(err => {
        console.log(err);
      });
}