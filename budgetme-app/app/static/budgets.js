function showBudgetMenu(event, budgetId) {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${budgetId}`);
    // Hide all other menus
    document.querySelectorAll('.budget-menu').forEach(m => {
        if (m.id !== `menu-${budgetId}`) {
            m.classList.remove('show');
        }
    });
    menu.classList.toggle('show');
}

function openBudgetModal(){
    document.getElementById('addBudgetModal').style.display = 'block';
}

function closeBudgetModal() {
    document.getElementById('addBudgetModal').style.display = 'none';
}

function addBudget() {
    const formData = new FormData(document.getElementById('addBudgetForm'));

    fetch('/api/budgets', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Budget added successfully');
        closeBudgetModal();
        location.reload();
    })
    .catch(error => console.error('Error adding budget:', error));
}

function openEditBudgetModal(budgetId) {
    fetch(`/api/budgets/${budgetId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editBudgetId').value = data.id;
            document.getElementById('editName').value = data.name;
            document.getElementById('editStartBalance').value = data.start_balance;
            document.getElementById('editUserId').value = data.user_id;
            document.getElementById('editMonthlyBudgetId').value = data.monthly_budget_id;
            document.getElementById('editBudgetModal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching budget data:', error));
}

function closeEditBudgetModal() {
    document.getElementById('editBudgetModal').style.display = 'none';
}

document.getElementById('editBudgetForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const budgetId = document.getElementById('editBudgetId').value;

    fetch(`/api/budgets/${budgetId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Budget updated successfully');
        closeEditBudgetModal();
        location.reload();
    })
    .catch(error => console.error('Error updating budget:', error));
});

function deleteBudget(budgetId) {
    if (confirm('Are you sure you want to delete this budget?')) {
        fetch(`/api/budgets/${budgetId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.error('Error:', error));
    }
}

// Close menus when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.budget-card')) {
        document.querySelectorAll('.budget-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});