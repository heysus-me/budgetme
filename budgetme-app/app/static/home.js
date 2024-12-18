document.addEventListener('DOMContentLoaded', function() {
    const budgetSelect = document.getElementById('budgetSelect');
    const expensesPieChart = document.getElementById('expensesPieChart').getContext('2d');
    let chart;
    let selectedBudgetId = null;
    let selectedTransactionId = null;

    budgetSelect.addEventListener('change', function() {
        const selectedOption = budgetSelect.options[budgetSelect.selectedIndex];
        selectedBudgetId = selectedOption.value;
        updatePieChart(selectedBudgetId);
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
                                align: 'end',
                                offset: 10
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

    // Initialize the chart with the first budget
    if (budgetSelect.value) {
        const initialBudgetId = budgetSelect.value;
        updatePieChart(initialBudgetId);
    }

    // Data for the balance bar chart
    const balanceData = {
        labels: ['Start Balance', 'End Balance'],
        datasets: [{
            label: 'Balance',
            data: [1000, 800], // Replace with actual start and end balance values
            backgroundColor: ['#9e9e9e', '#f44336'], // Neutral color for start balance, red for end balance
            borderColor: ['#757575', '#d32f2f'], // Neutral border color for start balance, darker red for end balance
            borderWidth: 1,
            borderRadius: 5,
            barThickness: 15, // Adjusted bar thickness
            maxBarThickness: 15 // Maximum bar thickness
        }]
    };

    // Configuration for the balance bar chart
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
                        display: false
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
                    anchor: 'end',
                    align: 'start',
                    offset: 10,
                    color: '#000',
                    font: {
                        size: 14
                    },
                    formatter: function(value) {
                        return '$' + value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    };
    // Render the balance bar chart
    const balanceBarChart = new Chart(
        document.getElementById('balanceBarChart'),
        balanceConfig
    );
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
                    showTransactionDetails(transaction);
                });

                container.appendChild(transactionDiv);
            });
        });
}

// Modal functionality for adding transactions
function openAddTransactionModal() {
    document.getElementById('addTransactionModal').style.display = 'block';
}

function closeAddTransactionModal() {
    document.getElementById('addTransactionModal').style.display = 'none';
}

// Modal functionality for transaction details
function showTransactionDetails(transaction) {
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

function editTransaction() {
    // Implement edit functionality
    alert('Edit functionality to be implemented');
}

function deleteTransaction() {
    if (confirm('Are you sure you want to delete this transaction?')) {
        fetch(`/api/transactions/${selectedTransactionId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Transaction deleted successfully');
            closeTransactionDetailsModal();
            // Optionally, refresh the transactions list or pie chart
        })
        .catch(error => console.error('Error:', error));
    }
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
        // Optionally, refresh the transactions list or pie chart
    })
    .catch(error => console.error('Error:', error));
});