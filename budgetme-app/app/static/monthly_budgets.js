// Modal functionality for adding monthly budgets
function openNewMonthlyBudgetModal() {
    document.getElementById('addMonthlyBudgetModal').style.display = 'block';
}

function closeNewMonthlyBudgetModal() {
    document.getElementById('addMonthlyBudgetModal').style.display = 'none';
}

// Modal functionality for editing monthly budgets
function openEditMonthlyBudgetModal(monthlyBudgetId) {
    fetch(`/api/monthlybudgets/${monthlyBudgetId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editMonthlyBudgetId').value = data.id;
            document.getElementById('editName').value = data.name;
            document.getElementById('editStartingBalance').value = data.starting_balance;
            document.getElementById('editYear').value = data.year;
            document.getElementById('editMonth').value = data.month;
            document.getElementById('editUserId').value = data.user_id;
            document.getElementById('editMonthlyBudgetModal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching monthly budget data:', error));
}

function closeEditMonthlyBudgetModal() {
    document.getElementById('editMonthlyBudgetModal').style.display = 'none';
}

// Handle form submission for adding monthly budgets
document.getElementById('monthlyBudgetForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/api/monthlybudgets', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Monthly Budget added successfully');
        closeNewMonthlyBudgetModal();
        // Refresh the page content
        location.reload();
    })
    .catch(error => console.error('Error:', error));
});

// Handle form submission for editing monthly budgets
document.getElementById('editMonthlyBudgetForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const monthlyBudgetId = document.getElementById('editMonthlyBudgetId').value;

    fetch(`/api/monthlybudgets/${monthlyBudgetId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Monthly Budget updated successfully');
        closeEditMonthlyBudgetModal();
        location.reload();
    })
    .catch(error => console.error('Error updating monthly budget:', error));
});

function deleteMonthlyBudget(monthlyBudgetId) {
    if (confirm('Are you sure you want to delete this monthly budget?')) {
        fetch(`/api/monthlybudgets/${monthlyBudgetId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.error('Error:', error));
    }
}