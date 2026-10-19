const form = document.getElementById('admissionForm');
const tableBody = document.getElementById('studentTableBody');
const totalCount = document.getElementById('totalCount');
const recordPill = document.getElementById('recordPill');
const notice = document.getElementById('formNotice');
const searchInput = document.getElementById('searchStudents');

const fields = ['fullName', 'matricNo', 'email', 'phone', 'age', 'department', 'password'];
const STORAGE_KEY = 'campusAdmissionStudents_v1';
let students = loadStudents();

function loadStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}
function value(id) {
  return document.getElementById(id).value.trim();
}
function setError(id, message = '') {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}Error`);
  input.classList.toggle('invalid', Boolean(message));
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
}
function showNotice(message, type) {
  notice.textContent = message;
  notice.className = `form-notice ${type}`;
}
function clearNotice() {
  notice.textContent = '';
  notice.className = 'form-notice';
}
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function normalizeMatric(matric) {
  return matric.trim().toUpperCase();
}

function validate() {
  const data = {
    fullName: value('fullName'),
    matricNo: value('matricNo'),
    email: value('email'),
    phone: value('phone'),
    age: value('age'),
    department: value('department'),
    password: document.getElementById('password').value
  };
  const errors = {};

  if (!data.fullName) errors.fullName = 'Please enter the student’s full name.';
  else if (data.fullName.length < 3 || !/^[\p{L}][\p{L}\s.'’-]*$/u.test(data.fullName)) {
    errors.fullName = 'Enter a valid name (at least 3 letters; no numbers).';
  }

  if (!data.matricNo) errors.matricNo = 'Please enter a matriculation number.';
  else if (!/^[A-Za-z0-9]+(?:[/-][A-Za-z0-9]+)*$/.test(data.matricNo)) {
    errors.matricNo = 'Use letters, numbers, slashes or hyphens only.';
  } else if (students.some(s => normalizeMatric(s.matricNo) === normalizeMatric(data.matricNo))) {
    errors.matricNo = 'This matriculation number is already registered.';
  }

  if (!data.email) errors.email = 'Please enter an email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = 'Enter a valid email, e.g. name@example.com.';
  else if (students.some(s => normalizeEmail(s.email) === normalizeEmail(data.email))) {
    errors.email = 'This email address is already registered.';
  }

  const digits = data.phone.replace(/[\s()+.-]/g, '');
  if (!data.phone) errors.phone = 'Please enter a phone number.';
  else if (!/^\d{10,15}$/.test(digits)) errors.phone = 'Enter 10–15 digits; you may include +, spaces or hyphens.';

  const age = Number(data.age);
  if (!data.age) errors.age = 'Please enter the student’s age.';
  else if (!Number.isInteger(age) || age < 16 || age > 100) errors.age = 'Age must be a whole number from 16 to 100.';

  if (!data.department) errors.department = 'Please select a department.';

  if (!data.password) errors.password = 'Please create a password.';
  else if (data.password.length < 8 || !/[A-Za-z]/.test(data.password) || !/\d/.test(data.password)) {
    errors.password = 'Use at least 8 characters, including a letter and a number.';
  }

  fields.forEach(id => setError(id, errors[id] || ''));
  return { data, errors };
}

function renderStudents() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = students.filter(s =>
    [s.fullName, s.matricNo, s.email, s.department].some(v => v.toLowerCase().includes(query))
  );
  totalCount.textContent = String(students.length);
  recordPill.textContent = `${students.length} ${students.length === 1 ? 'record' : 'records'}`;

  if (!visible.length) {
    const message = students.length
      ? 'No matching students found'
      : 'No students registered yet';
    const detail = students.length
      ? 'Try another name, email, matric number or department.'
      : 'Registered students will appear here.';
    tableBody.innerHTML = `<tr class="empty-row"><td colspan="5"><div class="empty-state"><span>▤</span><strong>${message}</strong><small>${detail}</small></div></td></tr>`;
    return;
  }

  tableBody.innerHTML = visible.map(student => `
    <tr>
      <td><div class="student-name">${escapeHTML(student.fullName)}</div><div class="student-email">${escapeHTML(student.email)}</div></td>
      <td><span class="matric-code">${escapeHTML(student.matricNo)}</span></td>
      <td class="department-cell">${escapeHTML(student.department)}</td>
      <td>${student.age}</td>
      <td><button type="button" class="delete-row" data-delete="${student.id}" aria-label="Delete ${escapeHTML(student.fullName)}">Delete</button></td>
    </tr>
  `).join('');
}
function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

form.addEventListener('submit', event => {
  event.preventDefault();
  clearNotice();
  const { data, errors } = validate();
  if (Object.keys(errors).length) {
    showNotice('Please correct the highlighted fields before registering.', 'failure');
    const firstInvalid = fields.find(id => errors[id]);
    if (firstInvalid) document.getElementById(firstInvalid).focus();
    return;
  }

  // This is a front-end demo. Passwords are deliberately not stored.
  students.unshift({
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    fullName: data.fullName,
    matricNo: normalizeMatric(data.matricNo),
    email: normalizeEmail(data.email),
    phone: data.phone,
    age: Number(data.age),
    department: data.department
  });
  saveStudents();
  renderStudents();
  form.reset();
  fields.forEach(id => setError(id, ''));
  showNotice('Student registered successfully. The record has been added to the table.', 'success');
});

fields.forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener('input', () => {
    if (input.classList.contains('invalid')) validate();
    clearNotice();
  });
  input.addEventListener('change', () => {
    if (input.classList.contains('invalid')) validate();
  });
});

document.getElementById('togglePassword').addEventListener('click', event => {
  const password = document.getElementById('password');
  const isPassword = password.type === 'password';
  password.type = isPassword ? 'text' : 'password';
  event.currentTarget.textContent = isPassword ? 'Hide' : 'Show';
  event.currentTarget.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
});

tableBody.addEventListener('click', event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  students = students.filter(s => s.id !== button.dataset.delete);
  saveStudents();
  renderStudents();
  showNotice('Student record deleted.', 'success');
});

document.getElementById('clearRecords').addEventListener('click', () => {
  if (!students.length) {
    showNotice('There are no student records to clear.', 'failure');
    return;
  }
  if (window.confirm('Delete all registered student records from this browser? This cannot be undone.')) {
    students = [];
    saveStudents();
    renderStudents();
    showNotice('All student records have been cleared.', 'success');
  }
});
searchInput.addEventListener('input', renderStudents);

renderStudents();
