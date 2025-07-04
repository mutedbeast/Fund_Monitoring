let isAuthenticated = false;
let currentUser = null;
let transactionList = [];

const authContainer = document.getElementById('auth-container');
const loginSection = document.getElementById('login-section');
const treasurerSection = document.getElementById('treasurer-section');
const publicDashboard = document.getElementById('public-dashboard');
const loginForm = document.getElementById('login-form');
const cancelLogin = document.getElementById('cancel-login');
const transactionModal = document.getElementById('transaction-modal');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const closeModal = document.getElementById('close-modal');
const cancelTransaction = document.getElementById('cancel-transaction');
const transactionForm = document.getElementById('transaction-form');
const proofModal = document.getElementById('proof-modal');
const proofImage = document.getElementById('proof-image');
const closeProof = document.getElementById('close-proof');
const downloadBtn = document.getElementById('download-btn');
const transactionTableBody = document.getElementById('transaction-table-body');

if (sessionStorage.getItem('currentUser')) {
  isAuthenticated = true;
  currentUser = sessionStorage.getItem('currentUser');
}
updateAuthUI();
const fundsChart = initFundsChart();

loginForm.addEventListener('submit', handleLogin);
cancelLogin.addEventListener('click', hideLogin);
addTransactionBtn.addEventListener('click', showTransactionModal);
closeModal.addEventListener('click', hideTransactionModal);
cancelTransaction.addEventListener('click', hideTransactionModal);
transactionForm.addEventListener('submit', handleTransactionSubmit);
closeProof.addEventListener('click', hideProofModal);
downloadBtn.addEventListener('click', downloadCSV);

function initFundsChart() {
  const ctx = document.getElementById('fundsChart').getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [{
        label: 'Funds Used (₹)',
        data: [1000, 2000, 1800, 2400, 3000, 3500, 3200, 4000],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

const mockDatabase = {
  users: [
    { username: 'treasurer1', password: 'clubfunds2025', club: 'Cultural Club' },
    { username: 'treasurer2', password: 'securePass123', club: 'Sports Club' }
  ]
};

function updateAuthUI() {
  if (isAuthenticated) {
    authContainer.innerHTML = `
      <div class="flex items-center space-x-4">
        <span class="text-white">Welcome, ${currentUser}</span>
        <button id="logout-btn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </div>`;
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    treasurerSection.classList.remove('hidden');
    publicDashboard.classList.add('hidden');
  } else {
    authContainer.innerHTML = `<button id="login-btn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Treasurer Login</button>`;
    document.getElementById('login-btn').addEventListener('click', showLogin);
    treasurerSection.classList.add('hidden');
    publicDashboard.classList.remove('hidden');
  }
}

function showLogin() {
  loginSection.classList.remove('hidden');
}
function hideLogin() {
  loginSection.classList.add('hidden');
  loginForm.reset();
}
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const user = mockDatabase.users.find(u => u.username === username && u.password === password);
  if (user) {
    isAuthenticated = true;
    currentUser = user.username;
    sessionStorage.setItem('currentUser', currentUser);
    sessionStorage.setItem('userClub', user.club);
    updateAuthUI();
    hideLogin();
  } else {
    alert('Invalid credentials.');
  }
}
function handleLogout() {
  isAuthenticated = false;
  currentUser = null;
  sessionStorage.clear();
  updateAuthUI();
}

function showTransactionModal() {
  transactionModal.classList.remove('hidden');
}
function hideTransactionModal() {
  transactionModal.classList.add('hidden');
  transactionForm.reset();
}

function handleTransactionSubmit(e) {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const purpose = document.getElementById('purpose').value;
  const amount = document.getElementById('amount').value;
  const approver = document.getElementById('approver').value;
  const proof = document.getElementById('proof').files[0];

  if (!date || !purpose || !amount || !approver || !proof) {
    alert('Please fill in all fields.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const proofURL = reader.result;

    const newTransaction = {
      date,
      purpose,
      amount: parseFloat(amount),
      approver,
      proof: proofURL
    };

    transactionList.push(newTransaction);
    updateTransactionTable();
    updateChart(amount);
    hideTransactionModal();
  };
  reader.readAsDataURL(proof);
}

function updateTransactionTable() {
  transactionTableBody.innerHTML = '';
  transactionList.forEach((txn, idx) => {
    const row = `<tr class="hover:bg-gray-100">
        <td class="px-6 py-4">${txn.date}</td>
        <td class="px-6 py-4">${txn.purpose}</td>
        <td class="px-6 py-4">₹${txn.amount}</td>
        <td class="px-6 py-4">${txn.approver}</td>
        <td class="px-6 py-4"><span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">Approved</span></td>
        <td class="px-6 py-4"><button class="text-blue-600 underline" onclick="showProofFromData('${txn.proof}')">View</button></td>
      </tr>`;
    transactionTableBody.innerHTML += row;
  });
}

function showProofFromData(src) {
  proofImage.src = src;
  proofModal.classList.remove('hidden');
}
function hideProofModal() {
  proofModal.classList.add('hidden');
}

function updateChart(newAmount) {
  const lastMonthIdx = fundsChart.data.datasets[0].data.length - 1;
  fundsChart.data.datasets[0].data[lastMonthIdx] += parseFloat(newAmount);
  fundsChart.update();
}

function downloadCSV() {
  if (transactionList.length === 0) {
    alert('No data to export.');
    return;
  }

  let csvContent = "Date,Purpose,Amount,Approver\n";
  transactionList.forEach(txn => {
    csvContent += `${txn.date},${txn.purpose},${txn.amount},${txn.approver}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}
