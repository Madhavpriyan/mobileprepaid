document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const enteredUsername = document.getElementById('username').value;
  const enteredPassword = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  fetch('/mpproject/admin/js/data.json') // Adjust the path if needed
      .then(response => response.json())
      .then(data => {
          if (enteredUsername === data.username && enteredPassword === data.password) {
              // Store session login
              sessionStorage.setItem('loggedIn', 'true');

              // Remember Me functionality (stores in localStorage if checked)
              if (rememberMe) {
                  localStorage.setItem('username', enteredUsername);
                  localStorage.setItem('password', enteredPassword);
              } else {
                  localStorage.removeItem('username');
                  localStorage.removeItem('password');
              }

              // Redirect to dashboard
              window.location.href = data.redirectUrl;
          } else {
              document.getElementById('loginError').style.display = 'block';
          }
      })
      .catch(error => console.error('Error loading JSON:', error));
});

// Auto-fill saved credentials if "Remember Me" was checked before
window.onload = function () {
  if (localStorage.getItem('username') && localStorage.getItem('password')) {
      document.getElementById('username').value = localStorage.getItem('username');
      document.getElementById('password').value = localStorage.getItem('password');
      document.getElementById('rememberMe').checked = true;
  }
};
