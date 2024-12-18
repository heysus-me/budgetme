function editBudget(budgetId) {
    // Implement the logic to edit the budget
    console.log('Edit budget with ID:', budgetId);
    // Redirect to the edit budget page or open a modal
    //window.location.href = `/edit-budget/${budgetId}`;
}

function deleteBudget(budgetId) {
    // Implement the logic to delete the budget
    console.log('Delete budget with ID:', budgetId);
    if (confirm('Are you sure you want to delete this budget?')) {
        fetch(`/api/budgets/${budgetId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Remove the budget element from the DOM
                const budgetElement = document.getElementById(`budget-${budgetId}`);
                if (budgetElement) {
                    budgetElement.remove();
                } else {
                    console.error(`Element with ID budget-${budgetId} not found.`);
                }
                // Refresh the page content
                location.reload();
            } else {
                alert('Failed to delete the budget.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete the budget.');
        });
    }
}

// Modal functionality for adding budgets
function openNewBudgetModal() {
    document.getElementById('addBudgetModal').style.display = 'block';
}

function closeNewBudgetModal() {
    document.getElementById('addBudgetModal').style.display = 'none';
}

// Handle form submission for adding budgets
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
        closeNewBudgetModal();
        // Refresh the page content
        location.reload();
    })
    .catch(error => console.error('Error:', error));
});