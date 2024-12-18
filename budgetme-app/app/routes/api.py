from flask import Blueprint, request, jsonify
from ..models import Transaction, Budget, Category, db
from datetime import datetime

api_bp = Blueprint('api', __name__)

# Other routes
@api_bp.route('/expenses')
def get_expenses():
    budget_id = request.args.get('budget_id')
    
    if budget_id:
        expenses = Transaction.query.filter_by(type='expense', budget_id=budget_id).all()
    else:
        expenses = Transaction.query.filter_by(type='expense').all()
    
    category_totals = {}

    for expense in expenses:
        category = expense.category.name if expense.category else 'Uncategorized'
        if category in category_totals:
            category_totals[category] += expense.amount
        else:
            category_totals[category] = expense.amount

    expenses_data = [{'category': category, 'amount': amount} for category, amount in category_totals.items()]
    return jsonify(expenses_data)

# Transactions CRUD
@api_bp.route('/transactions', methods=['GET'])
def get_transactions():
    category_name = request.args.get('category')
    budget_id = request.args.get('budget_id')
    if category_name == 'Uncategorized':
        transactions = Transaction.query.filter_by(type='expense', category_id=None, budget_id=budget_id).all()
    else:
        transactions = Transaction.query.join(Category).filter(Transaction.type == 'expense', Category.name == category_name, Transaction.budget_id == budget_id).all()

    transactions_data = [
        {
            'id': transaction.id,
            'type': transaction.type,
            'category': transaction.category.name if transaction.category else 'Uncategorized',
            'amount': transaction.amount,
            'description': transaction.description,
            'date': transaction.date.strftime('%Y-%m-%d')
        }
        for transaction in transactions
    ]
    return jsonify(transactions_data)

@api_bp.route('/transaction/<int:transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    transaction_data = {
        'id': transaction.id,
        'description': transaction.description,
        'amount': transaction.amount,
        'type': transaction.type,
        'date': transaction.date.strftime('%Y-%m-%d'),
        'budget_id': transaction.budget_id,
        'budget_name': transaction.budget.name,
        'category_id': transaction.category_id,
        'category_name': transaction.category.name if transaction.category else 'Uncategorized',
    }
    return jsonify(transaction_data)

@api_bp.route('/transactions', methods=['POST'])
def add_transaction():
    description = request.form['description']
    amount = float(request.form['amount'])
    type = request.form['type']
    date_str = request.form['date']
    date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()
    budget_id = int(request.form['budget_id'])
    category_id = int(request.form['category_id']) if request.form['category_id'] else None

    new_transaction = Transaction(
        description=description,
        amount=amount,
        type=type,
        date=date,
        budget_id=budget_id,
        category_id=category_id
    )
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction added successfully', 'transaction': {
        'id': new_transaction.id,
        'description': new_transaction.description,
        'amount': new_transaction.amount,
        'type': new_transaction.type,
        'date': new_transaction.date.strftime('%Y-%m-%d'),
        'budget_id': new_transaction.budget_id,
        'category_id': new_transaction.category_id
    }})

@api_bp.route('/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    transaction.description = request.form['description']
    transaction.amount = float(request.form['amount'])
    transaction.type = request.form['type']
    date_str = request.form['date']
    transaction.date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()
    transaction.budget_id = int(request.form['budget_id'])
    transaction.category_id = int(request.form['category_id']) if request.form['category_id'] else None
    db.session.commit()

    return jsonify({'message': 'Transaction updated successfully', 'transaction': {
        'id': transaction.id,
        'description': transaction.description,
        'amount': transaction.amount,
        'type': transaction.type,
        'date': transaction.date.strftime('%Y-%m-%d'),
        'budget_id': transaction.budget_id,
        'category_id': transaction.category_id
    }})

@api_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted successfully'})

# Budgets CRUD
@api_bp.route('/budgets', methods=['GET'])
def get_budgets():
    budgets = Budget.query.all()
    budgets_data = [
        {
            'id': budget.id,
            'name': budget.name,
            'amount': budget.start_balance,
            'user_id': budget.user_id
        }
        for budget in budgets
    ]
    return jsonify(budgets_data)

@api_bp.route('/budgets/<int:budget_id>', methods=['GET'])
def get_budget(budget_id):
    budget = Budget.query.get_or_404(budget_id)
    budget_data = {
        'id': budget.id,
        'name': budget.name,
        'income': budget.income,
        'expenses': budget.expenses,
        'start_balance': budget.start_balance,
        'end_balance': budget.end_balance,
        'user_id': budget.user_id
    }
    return jsonify(budget_data)

@api_bp.route('/budgets', methods=['POST'])
def add_budget():
    name = request.form['name']
    start_balance = float(request.form['start_balance'])
    user_id = int(request.form['user_id'])

    new_budget = Budget(name=name, start_balance=start_balance, user_id=user_id)
    db.session.add(new_budget)
    db.session.commit()

    return jsonify({'message': 'Budget added successfully', 'budget': {
        'id': new_budget.id,
        'name': new_budget.name,
        'start_balance': new_budget.start_balance,
        'user_id': new_budget.user_id
    }})

@api_bp.route('/budgets/<int:budget_id>', methods=['PUT'])
def update_budget(budget_id):
    budget = Budget.query.get_or_404(budget_id)
    budget.name = request.form['name']
    budget.start_balance = float(request.form['amount'])
    budget.user_id = int(request.form['user_id'])
    db.session.commit()

    return jsonify({'message': 'Budget updated successfully', 'budget': {
        'id': budget.id,
        'name': budget.name,
        'start_blance': budget.start_balance,
        'end_blance': budget.end_balance,
        'user_id': budget.user_id
    }})

@api_bp.route('/budgets/<int:budget_id>', methods=['DELETE'])
def delete_budget(budget_id):
    budget = Budget.query.get_or_404(budget_id)
    db.session.delete(budget)
    db.session.commit()
    return jsonify({'message': 'Budget deleted successfully'})

# Categories CRUD
@api_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    categories_data = [
        {
            'id': category.id,
            'name': category.name
        }
        for category in categories
    ]
    return jsonify(categories_data)

@api_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get_or_404(category_id)
    category_data = {
        'id': category.id,
        'name': category.name
    }
    return jsonify(category_data)

@api_bp.route('/categories', methods=['POST'])
def add_category():
    name = request.form['name']

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({'message': 'Category added successfully', 'category': {
        'id': new_category.id,
        'name': new_category.name
    }})

@api_bp.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    category.name = request.form['name']
    db.session.commit()

    return jsonify({'message': 'Category updated successfully', 'category': {
        'id': category.id,
        'name': category.name
    }})

@api_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'})