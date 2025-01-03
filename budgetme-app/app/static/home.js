document.addEventListener('DOMContentLoaded', function() {
    const budgetSelect = document.getElementById('budgetSelect');
    budgetSelect.addEventListener('change', function() {
        const selectedBudgetId = budgetSelect.value;
        filterBudgetCards(selectedBudgetId);
    });
    const balanceBarChart = initializeBalanceBarChart();

    budgetSelect.addEventListener('change', function() {
        const selectedOption = budgetSelect.options[budgetSelect.selectedIndex];
        selectedBudgetId = selectedOption.value;
        fetchBudgetData(selectedBudgetId);
        // loadCategories(selectedBudgetId);
    });

    function filterBudgetCards(monthlyBudgetId) {
        const budgetCards = document.querySelectorAll('.budget-card-wrapper');
        budgetCards.forEach(card => {
            if (monthlyBudgetId === '' || card.dataset.monthlyBudgetId === monthlyBudgetId) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Initialize the display based on the selected budget
    const initialBudgetId = budgetSelect.value;
    filterBudgetCards(initialBudgetId);

    // Initialize the chart with the first budget if available
    if (budgetSelect.value) {
        const initialBudgetId = budgetSelect.value;
        fetchBudgetData(initialBudgetId);
        // loadCategories(initialBudgetId);
    }

    function initializeBalanceBarChart() {
        const balanceData = {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Balance',
                data: [0, 0], // Initial data
                backgroundColor: ['#4caf50', '#f44336'], // Green for income, red for expenses
                borderColor: ['#388e3c', '#d32f2f'], // Darker green for income, darker red for expenses
                borderWidth: 1,
                borderRadius: 5,
                minBarThickness: 5,
                barThickness: 15, // Adjusted bar thickness
                maxBarThickness: 35 // Maximum bar thickness
            }]
        };

        const balanceConfig = {
            type: 'bar',
            data: balanceData,
            options: {
                indexAxis: 'y',
                layout: {
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: true
                        },
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleFont: {
                            size: 16
                        },
                        bodyFont: {
                            size: 14
                        },
                        cornerRadius: 5
                    },
                    datalabels: {
                        anchor: 'center',
                        align: 'right',
                        offset: 10,
                        color: '#000',
                        font: {
                            size: 14
                        },
                        formatter: function(value) {
                            return '$' + Math.round(value);
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        };

        return new Chart(document.getElementById('balanceBarChart'), balanceConfig);
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Ensure selectedBudgetId is defined and valid
        const selectedBudgetId = getSelectedBudgetId();
        if (selectedBudgetId) {
            fetchBudgetData(selectedBudgetId);
        } else {
            console.error('No valid budget ID selected');
        }
    });
    
    function getSelectedBudgetId() {
        // Logic to get the selected budget ID, e.g., from a dropdown or other UI element
        const budgetSelect = document.getElementById('budgetSelect');
        return budgetSelect ? budgetSelect.value : null;
    }
    
    function fetchBudgetData(budgetId) {
        if (!budgetId) {
            console.error('Invalid budget ID: ', budgetId);
            return;
        }
    
        fetch(`/api/monthlybudgets/${budgetId}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.monthly_budgets)) {
                    data.monthly_budgets.forEach(budget => {
                        updateBalanceBarChart(budget.income, budget.expenses);
                        updateBalanceInfo(budget.starting_balance, budget.end_balance);
                    });
                } else if (data) {
                    const budget = data;
                    updateBalanceBarChart(budget.income, budget.expenses);
                    updateBalanceInfo(budget.starting_balance, budget.end_balance);
                } else {
                    console.error('Expected an array or a single budget object');
                }
            })
            .catch(error => console.error('Error fetching budget data:', error));
    }
    
    function updateBalanceBarChart(income, expenses) {
        const balanceBarChart = Chart.getChart('balanceBarChart');
        balanceBarChart.data.datasets[0].data = [income, expenses];
        balanceBarChart.update();
    }
    
    function updateBalanceInfo(startingBalance, endBalance) {
        document.getElementById('startBalance').textContent = `$${startingBalance.toFixed(2)}`;
        document.getElementById('currentBalance').textContent = `$${endBalance.toFixed(2)}`;
    }

    // Modal functionality for adding transactions
    document.getElementById('transactionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch('/api/transactions', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const transactionData = data;
            alert('Transaction added successfully');
            closeAddTransactionModal();
            // Refresh budget data using monthly_budget_id from transaction response
            console.log(transactionData['transaction']['monthly_budget_id']);
            fetchBudgetData(transactionData['transaction']['monthly_budget_id']);
        })
        .catch(error => console.error('Error:', error));
    });
});

function openAddTransactionModal() {
    document.getElementById('addTransactionModal').style.display = 'block';
}


function closeAddTransactionModal() {
    document.getElementById('addTransactionModal').style.display = 'none';
    location.reload(); // Reload the page
    // reloadBudgetCards();
}


function openTransactionDetailsModal(transaction) {
    selectedTransactionId = transaction.id;
    fetch(`/api/transaction/${transaction.id}`)
        .then(response => response.json())
        .then(data => {
            const transactionDetails = document.getElementById('transactionDetails');
            transactionDetails.innerHTML = `
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Amount:</strong> $${data.amount}</p>
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Budget:</strong> ${data.budget_name}</p>
                <p><strong>Category:</strong> ${data.category_name}</p>
            `;
            document.getElementById('transactionDetailsModal').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}

function closeTransactionDetailsModal() {
    document.getElementById('transactionDetailsModal').style.display = 'none';
}

function openEditTransactionModal() {
    closeTransactionDetailsModal();
    fetch(`/api/transaction/${selectedTransactionId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editDescription').value = data.description;
            document.getElementById('editAmount').value = data.amount;
            document.getElementById('editType').value = data.type;
            document.getElementById('editDate').value = data.date;
            document.getElementById('editBudgetId').value = data.budget_id;
            document.getElementById('editCategoryId').value = data.category_id;
            document.getElementById('editTransactionModal').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}

function editTransaction() {
    const formData = new FormData(document.getElementById('editTransactionForm'));
    fetch(`/api/transactions/${selectedTransactionId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Transaction updated successfully');
        closeEditTransactionModal();
        openTransactionDetailsModal({ id: selectedTransactionId });
        // Optionally, refresh the transactions list or pie chart
    })
    .catch(error => console.error('Error:', error));
}

function closeEditTransactionModal() {
    document.getElementById('editTransactionModal').style.display = 'none';
}


function toggleBudgetField() {
    const type = document.getElementById('type').value;
    const budgetGroup = document.getElementById('budgetGroup');
    const budgetSelect = document.getElementById('budget_id');
    const categoryGroup = document.getElementById('categoryGroup');
    const categorySelect = document.getElementById('category_id');
    // const categorySelect = document.getElementById('category_id');
    
    if (type === 'income') {
        budgetGroup.style.display = 'none';
        budgetSelect.removeAttribute('required');
        budgetSelect.value = '1';
    } else {
        budgetGroup.style.display = 'block';
        categoryGroup.style.display = 'block';
        budgetSelect.setAttribute('required', '');
    }
}

function reloadBudgetCards() {
    fetch('/api/budgets')
        .then(response => response.json())
        .then(budgets => {
            let budgetCardsHtml = budgets.map(budget => `
                <div class="col-12 col-md-6 col-lg-4 budget-card-wrapper" data-monthly-budget-id="${budget.monthly_budget_id}">
                    <div class="budget-card">
                        <div class="budget-card-header">
                            <h5>${budget.name}</h5>
                            <span class="badge ${budget.start_balance > 0 ? 'bg-success' : 'bg-danger'}">
                                $${budget.start_balance}
                            </span>
                        </div>
                        <div class="budget-card-body">
                            <p class="description">${budget.description}</p>
                            <div class="progress mb-3">
                                <div class="progress-bar ${budget.start_balance > 0 ? 'bg-success' : 'bg-danger'}" role="progressbar" style="width: ${budget.start_balance > 0 ? Math.round((budget.expenses / budget.start_balance) * 100) : 0}%;">
                                    ${budget.start_balance > 0 ? Math.round((budget.expenses / budget.start_balance) * 100) : 0}%
                                </div>
                            </div>
                            <div class="budget-info">
                                <span>Spent: $${budget.expenses}</span>
                                <span>Remaining: $${budget.start_balance - budget.expenses}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            document.getElementById('budgetCardsContainer').innerHTML = budgetCardsHtml;
        })
        .catch(error => console.error('Error:', error));
}

// Call on page load to set initial state
document.addEventListener('DOMContentLoaded', toggleBudgetField);

/* Add category functionality */
// Function to open the Add Category modal
function openAddCategoryModal() {
    document.getElementById('addCategoryModal').style.display = 'block';
}

// Function to close the Add Category modal
function closeAddCategoryModal() {
    document.getElementById('addCategoryModal').style.display = 'none';
    location.reload(); // Reload the page

}

// Handle the Add Category form submission
document.getElementById('categoryForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/api/categories', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Category added successfully');
        closeAddCategoryModal();
        // Optionally, refresh the categories list or update the UI
    })
    .catch(error => console.error('Error:', error));
});

/* Add budget functionality */
// Function to open the Add Budget modal
function openAddBudgetModal() {
    const selectedMonthlyBudgetId = getSelectedMonthlyBudgetId(); // Get the selected monthly budget ID
;
    document.getElementById('monthlyBudgetId').value = selectedMonthlyBudgetId;

    document.getElementById('addBudgetModal').style.display = 'block';
}

// Function to close the Add Budget modal
function closeAddBudgetModal() {
    document.getElementById('addBudgetModal').style.display = 'none';
    location.reload(); // Reload the page
}

// Handle the Add Budget form submission
document.getElementById('budgetForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/api/budgets', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Budget added successfully');
        closeAddBudgetModal();
        // Optionally, refresh the budgets list or update the UI
    })
    .catch(error => console.error('Error:', error));
});

// Function to get the selected monthly budget ID
function getSelectedMonthlyBudgetId() {
    const budgetSelect = document.getElementById('budgetSelect');
    return budgetSelect ? budgetSelect.value : null;
}

// Function to navigate to the transaction_category.html page
function navigateToTransactions(monthlyBudgetId, budgetId, categoryId) {
    const url = `/transactions_category?monthly_budget_id=${monthlyBudgetId}&budget_id=${budgetId}`;
    window.location.href = url;
}