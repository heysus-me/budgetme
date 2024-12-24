// Function to open the edit transaction modal and populate it with transaction data
function editTransaction(transactionId) {
    fetch(`/api/transaction/${transactionId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editTransactionId').value = data.id;
            document.getElementById('editDescription').value = data.description;
            document.getElementById('editAmount').value = data.amount;
            document.getElementById('editType').value = data.type;
            document.getElementById('editDate').value = data.date.split('T')[0]; // Format date
            document.getElementById('editBudgetId').value = data.budget_id;
            document.getElementById('editCategoryId').value = data.category_id || '';

            document.getElementById('editTransactionModal').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}

// Function to close the edit transaction modal
function closeEditTransactionModal() {
    document.getElementById('editTransactionModal').style.display = 'none';
}

// Handle the edit transaction form submission
document.getElementById('editTransactionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const transactionId = document.getElementById('editTransactionId').value;
    console.log(transactionId);
    
    const formData = new FormData(event.target);
    fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Transaction updated successfully');
        closeEditTransactionModal();
        location.reload(); // Reload the page to reflect changes
    })
    .catch(error => console.error('Error:', error));
});

// Function to delete a transaction
function deleteTransaction(transactionId) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        fetch(`/api/transactions/${transactionId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Transaction deleted successfully');
                location.reload(); // Reload the page to reflect changes
            } else {
                alert('Failed to delete transaction');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}