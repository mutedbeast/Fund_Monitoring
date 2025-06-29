// Initialize authentication state
        let isAuthenticated = false;
        let currentUser = null;

        // DOM Elements
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

        // Initialize UI and check for existing session
        if (sessionStorage.getItem('currentUser')) {
            isAuthenticated = true;
            currentUser = sessionStorage.getItem('currentUser');
        }
        updateAuthUI();
        const fundsChart = initFundsChart();

        // Event Listeners
        loginForm.addEventListener('submit', handleLogin);
        cancelLogin.addEventListener('click', hideLogin);
        addTransactionBtn.addEventListener('click', showTransactionModal);
        closeModal.addEventListener('click', hideTransactionModal);
        cancelTransaction.addEventListener('click', hideTransactionModal);
        transactionForm.addEventListener('submit', handleTransactionSubmit);
        closeProof.addEventListener('click', hideProofModal);
        downloadBtn.addEventListener('click', downloadCSV);

        // Chart initialization
        function initFundsChart() {
            const ctx = document.getElementById('fundsChart').getContext('2d');
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Funds Used (₹)',
                        data: [4500, 2800, 3200, 4100, 5200, 3800, 4200, 5500, 6200, 7500, 5800, 4400],
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Amount (₹)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Month'
                            }
                        }
                    }
                }
            });
        }

        // Mock database for demonstration
        const mockDatabase = {
            clubs: [
                { id: 1, name: 'Cultural Club', allocated: 25000, spent: 18500 },
                { id: 2, name: 'Sports Club', allocated: 30000, spent: 21500 },
                { id: 3, name: 'Tech Club', allocated: 20000, spent: 9800 },
                { id: 4, name: 'Literary Club', allocated: 10000, spent: 2630 }
            ],
            users: [
                { username: 'treasurer1', password: 'clubfunds2025', club: 'Cultural Club' },
                { username: 'treasurer2', password: 'securePass123', club: 'Sports Club' },
                { username: 'treasurer3', password: 'techClub@2025', club: 'Tech Club' }
            ]
        };

        // Functions
        function updateAuthUI() {
            if (isAuthenticated) {
                authContainer.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <span class="text-white">Welcome, ${currentUser}</span>
                        <button id="logout-btn" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
                    </div>
                `;
                document.getElementById('logout-btn').addEventListener('click', handleLogout);
                treasurerSection.classList.remove('hidden');
                publicDashboard.classList.add('hidden');
            } else {
                authContainer.innerHTML = `
                    <button id="login-btn" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Treasurer Login</button>
                `;
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
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }

        function handleLogin(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Client-side validation
            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }

            // Simulate async authentication with a small delay
            setTimeout(() => {
                const user = mockDatabase.users.find(u => 
                    u.username === username && u.password === password
                );

                if (user) {
                    isAuthenticated = true;
                    currentUser = user.username;
                    
                    // Store user data in session
                    sessionStorage.setItem('currentUser', currentUser);
                    sessionStorage.setItem('userClub', user.club);
                    
                    hideLogin();
                    updateAuthUI();
                    
                    // Update chart with club-specific data
                    updateChartForClub(user.club);
                } else {
                    alert('Invalid credentials. Please try again.');
                }
            }, 500); // Small delay to simulate network request
        }

        function handleLogout() {
            isAuthenticated = false;
            currentUser = null;
            
            // Clear session data
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('userClub');
            
            updateAuthUI();
            alert('You have been logged out successfully.');
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
            
            // Get form values
            const date = document.getElementById('date').value;
            const purpose = document.getElementById('purpose').value;
            const amount = document.getElementById('amount').value;
            const category = document.getElementById('category').value;
            const approver = document.getElementById('approver').value;
            const proofFile = document.getElementById('proof').files[0];
            
            // Validate
            if (!date || !purpose || !amount || !approver || !proofFile) {
                alert('Please fill all required fields');
                return;
            }
            
            // Process the transaction (in a real app, this would be sent to a server)
            alert(`Transaction recorded:\nDate: ${date}\nPurpose: ${purpose}\nAmount: ₹${amount}\nCategory: ${category}\nApprover: ${approver}`);
            
            // Close modal and reset form
            hideTransactionModal();
            
            // In a real app, we would update the table with the new transaction
            // For now, we'll just alert
            alert('The transaction table has been updated.');
        }

        function showProof(proofId) {
            // In a real app, this would fetch the correct proof document
            proofImage.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f8671c57-3348-410c-a926-4a82289849ce.png
            proofModal.classList.remove('hidden');
        }

        function hideProofModal() {
            proofModal.classList.add('hidden');
        }

        function updateChartForClub(clubName) {
            // In a real app, fetch data from server based on club
            const clubData = {
                'Cultural Club': [3000, 2500, 4000, 3500, 5000, 3000, 4500, 6000, 5500, 5000, 4000, 3000],
                'Sports Club': [5000, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 6500, 8000, 6000, 5000],
                'Tech Club': [2000, 1500, 2500, 3000, 3500, 2500, 3000, 4000, 4500, 5000, 3500, 3000]
            };
            
            fundsChart.data.datasets[0].data = clubData[clubName] || [0,0,0,0,0,0,0,0,0,0,0,0];
            fundsChart.update();
        }

        function downloadCSV() {
            // Mock CSV download functionality
            alert('Downloading transaction data as CSV...');
            // In a real app, this would generate a CSV file from the data
        }

        // Additional helper functions for a real app would include:
        // - Fetching actual transaction data from a server
        // - Proper authentication with backend verification
        // - Data validation and error handling
        // - More robust proof/document management
        // - Audit trail functionality
        // - Reporting features