// Populate days
const daySel = document.getElementById('dob-day');
for (let i = 1; i <= 31; i++) {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = i;
  daySel.appendChild(opt);
}

// Populate months
const monthSel = document.getElementById('dob-month');
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
months.forEach((m, i) => {
  const opt = document.createElement('option');
  opt.value = i + 1;
  opt.textContent = m;
  monthSel.appendChild(opt);
});

// Populate years
const yearSel = document.getElementById('dob-year');
const thisYear = new Date().getFullYear();
for (let y = thisYear - 16; y >= 1900; y--) {
  const opt = document.createElement('option');
  opt.value = y;
  opt.textContent = y;
  yearSel.appendChild(opt);
}

// Show/hide password
function togglePassword() {
  const pw = document.getElementById('password');
  pw.type = pw.type === "password" ? "text" : "password";
}

// Edit email
function editEmail() {
  const email = document.getElementById('email');
  email.readOnly = false;
  email.focus();
  email.select();
}
