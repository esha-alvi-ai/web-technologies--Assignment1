document.getElementById('signInForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  // Simulate sign-in
  alert('Sign-in link sent to: ' + email);
});
