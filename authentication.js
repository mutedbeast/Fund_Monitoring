document.getElementById('in').addEventListener('click', () => {
  document.getElementById('sign-in').style.display = 'block';
  document.getElementById('sign-up').style.display = 'none';
  document.getElementById('up').classList.remove("unclicked");
  document.getElementById('in').classList.add("unclicked");
});

document.getElementById('up').addEventListener('click', () => {
  document.getElementById('sign-in').style.display = 'none';
  document.getElementById('sign-up').style.display = 'block';
  document.getElementById('in').classList.remove("unclicked");
  document.getElementById('up').classList.add("unclicked");
});

// Handle Sign Up
document.getElementById('sign-up-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (password !== confirm) {
    alert('Passwords do not match!');
    return;
  }

  localStorage.setItem('user', JSON.stringify({ name, email, password }));
  alert('Sign up successful! Please sign in.');
  document.getElementById('in').click();
});

// Handle Sign In
document.getElementById('sign-in-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.email === email && user.password === password) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUserEmail', email);
    window.location.href = 'home.html';
  } else {
    alert('Invalid email or password');
  }
});
