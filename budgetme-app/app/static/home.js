document.addEventListener('DOMContentLoaded', function() {
    const budgetSelect = document.getElementById('budgetSelect');
    const expensesPieChart = document.getElementById('expensesPieChart').getContext('2d');
    let chart;

    budgetSelect.addEventListener('change', function() {
        const selectedBudgetId = budgetSelect.value;
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
                            // Disable the datalabels plugin
                            datalabels: {
                                display: false
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
                    plugins: [] // Ensure the datalabels plugin is not included
                });
            });
    }

    // Initialize the chart with the first budget
    if (budgetSelect.value) {
        const initialBudgetId = budgetSelect.value;
        updatePieChart(initialBudgetId);
    }
});

function generateColors(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`;
        colors.push(color);
    }
    return colors;
}

// Load transactions for the selected category
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
                    window.location.href = `/transaction/${transaction.id}`;
                });

                container.appendChild(transactionDiv);
            });
        });
}

// Modal functionality
function openModal() {
    document.getElementById('transactionModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('transactionModal').style.display = 'none';
}

// Handle form submission
document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/api/add_transaction', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Transaction added successfully');
        closeModal();
        // Optionally, refresh the transactions list or pie chart
    })
    .catch(error => console.error('Error:', error));
});