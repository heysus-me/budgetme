document.addEventListener('DOMContentLoaded', function() {
    const budgetSelect = document.getElementById('budgetSelect');
    const expensesPieChart = document.getElementById('expensesPieChart').getContext('2d');
    let chart;
    let selectedBudgetId = null;
    let selectedTransactionId = null;
    const balanceBarChart = initializeBalanceBarChart();

    budgetSelect.addEventListener('change', function() {
        const selectedOption = budgetSelect.options[budgetSelect.selectedIndex];
        selectedBudgetId = selectedOption.value;
        updatePieChart(selectedBudgetId);
        fetchBudgetData(selectedBudgetId);
    });

    function updatePieChart(budgetId) {
        // Fetch the data for the selected budget
        const url = budgetId ? `/api/expenses?budget_id=${encodeURIComponent(budgetId)}` : '/api/expenses';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const categories = data.map(item => item.category);
                const amounts = data.map(item => item.amount);

                if (chart) {
                    chart.destroy();
                }

                chart = new Chart(expensesPieChart, {
                    type: 'pie',
                    data: {
                        labels: categories,
                        datasets: [{
                            data: amounts,
                            backgroundColor: generateColors(categories.length)
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false, // Allow the chart to resize
                        plugins: {
                            legend: {
                                display: true // Display the legend
                            },
                            title: {
                                display: true,
                                text: 'Expenses by Category'
                            },
                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = (value / total * 100).toFixed(2) + '%';
                                    return percentage;
                                },
                                color: '#fff',
                                backgroundColor: '#000',
                                borderRadius: 3,
                                font: {
                                    weight: 'bold'
                                },
                                anchor: 'end',
                                align: 'center',
                                offset: 0
                            }
                        },
                        onClick: (event, elements) => {
                            if (elements.length > 0) {
                                const chartElement = elements[0];
                                const category = chart.data.labels[chartElement.index];
                                loadTransactions(category, budgetId);
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Include the datalabels plugin
                });
            });
    }

    // Initialize the chart with the first budget if available
    if (budgetSelect.value) {
        const initialBudgetId = budgetSelect.value;
        updatePieChart(initialBudgetId);
        fetchBudgetData(initialBudgetId);
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

    function fetchBudgetData(budgetId) {
        fetch(`/api/budgets/${budgetId}`)
            .then(response => response.json())
            .then(data => {
                updateBalanceBarChart(data.income, data.expenses);
                updateBalanceInfo(data.start_balance, data.end_balance);
            })
            .catch(error => console.error('Error fetching budget data:', error));
    }

    function updateBalanceBarChart(startBalance, endBalance) {
        const balanceBarChart = Chart.getChart('balanceBarChart');
        balanceBarChart.data.datasets[0].data = [startBalance, endBalance];
        balanceBarChart.update();
    }

    function updateBalanceInfo(startBalance, endBalance) {
        document.getElementById('startBalance').textContent = `$${startBalance.toFixed(2)}`;
        document.getElementById('currentBalance').textContent = `$${endBalance.toFixed(2)}`;
    }

    // Handle form submission for adding transactions
    document.getElementById('transactionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch('/api/transactions', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('Transaction added successfully');
            closeAddTransactionModal();
            // Optionally, refresh the transactions list or update the charts
            fetchBudgetData(selectedBudgetId);
        })
        .catch(error => console.error('Error:', error));
    });
});

function generateColors(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`;
        colors.push(color);
    }
    return colors;
}

function loadTransactions(category, budgetId) {
    fetch(`/api/transactions?category=${encodeURIComponent(category)}&budget_id=${encodeURIComponent(budgetId)}`)
        .then(response => response.json())
        .then(transactions => {
            const container = document.getElementById('transactionsContainer');
            container.innerHTML = ''; // Clear previous transactions

            if (transactions.length === 0) {
                container.innerHTML = '<p>No transactions found for this category.</p>';
                return;
            }

            transactions.forEach(transaction => {
                const transactionDiv = document.createElement('div');
                transactionDiv.classList.add('transaction-item', 'card', 'shadow-sm', 'mb-3', 'p-3', 'rounded');

                const dateAmountDiv = document.createElement('div');
                dateAmountDiv.classList.add('transaction-date-amount', 'd-flex', 'justify-content-between', 'align-items-center');

                const dateDiv = document.createElement('div');
                dateDiv.classList.add('transaction-date', 'text-muted');
                dateDiv.textContent = transaction.date;

                const amountDiv = document.createElement('div');
                amountDiv.classList.add('transaction-amount', 'font-weight-bold');
                amountDiv.textContent = `$${transaction.amount}`;

                const descriptionDiv = document.createElement('div');
                descriptionDiv.classList.add('transaction-description', 'mt-2');
                descriptionDiv.textContent = transaction.description;

                dateAmountDiv.appendChild(dateDiv);
                dateAmountDiv.appendChild(amountDiv);

                transactionDiv.appendChild(dateAmountDiv);
                transactionDiv.appendChild(descriptionDiv);

                transactionDiv.addEventListener('click', () => {
                    openTransactionDetailsModal(transaction);
                });

                container.appendChild(transactionDiv);
            });
        });
}
// Modal functionality for adding transactions
function openAddTransactionModal() {
    document.getElementById('addTransactionModal').style.display = 'block';
}

// Modal functionality for transaction details
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

// Modal functionality for editing transactions
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
        openTransactionDetails();
        // Optionally, refresh the transactions list or pie chart
    })
    .catch(error => console.error('Error:', error));
}
function closeEditTransactionModal() {
    document.getElementById('editTransactionModal').style.display = 'none';
}