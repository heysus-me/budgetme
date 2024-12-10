# app/routes.py

from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from . import db
from .models import Budget, Transaction, Category, Settings, UserOptions
from datetime import datetime


bp = Blueprint('main', __name__)

@bp.route('/')
def home():
    budgets = Budget.query.all()
    return render_template('home.html', budgets=budgets)

@bp.route('/manage_budgets', methods=['GET', 'POST'])
def manage_budgets():
    if request.method == 'POST':
        if 'add_budget' in request.form:
            name = request.form['name']
            amount = float(request.form['amount'])

            new_budget = Budget(name=name, amount=amount, user_id=1)  # Assuming user_id=1 for simplicity
            db.session.add(new_budget)
            db.session.commit()
        elif 'delete_with_transactions' in request.form:
            budget_id = int(request.form['budget_id'])
            budget = Budget.query.get_or_404(budget_id)
            # Delete all transactions associated with the budget
            Transaction.query.filter_by(budget_id=budget_id).delete()
            db.session.commit()
            # Delete the budget
            db.session.delete(budget)
            db.session.commit()
        elif 'migrate_transactions' in request.form:
            budget_id = int(request.form['budget_id'])
            new_budget_id = int(request.form['new_budget_id'])
            budget = Budget.query.get_or_404(budget_id)
            # Migrate transactions to the new budget
            transactions = Transaction.query.filter_by(budget_id=budget_id).all()
            for transaction in transactions:
                transaction.budget_id = new_budget_id
            db.session.commit()
            # Delete the old budget
            db.session.delete(budget)
            db.session.commit()

        return redirect(url_for('main.manage_budgets'))

    budgets = Budget.query.all()
    return render_template('manage_budgets.html', budgets=budgets)

@bp.route('/manage_categories', methods=['GET', 'POST'])
def manage_categories():
    if request.method == 'POST':
        if 'add_category' in request.form:
            name = request.form['name']

            new_category = Category(name=name)
            db.session.add(new_category)
            db.session.commit()
        elif 'delete_category' in request.form:
            category_id = int(request.form['category_id'])
            category = Category.query.get_or_404(category_id)
            db.session.delete(category)
            db.session.commit()

        return redirect(url_for('main.manage_categories'))

    categories = Category.query.all()
    return render_template('manage_categories.html', categories=categories)

@bp.route('/manage_transactions', methods=['GET', 'POST'])
def manage_transactions():
    if request.method == 'POST':
        if 'add_transaction' in request.form:
            description = request.form['description']
            amount = float(request.form['amount'])
            type = request.form['type']
            date_str = request.form['date']
            date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()
            budget_id = int(request.form['budget_id'])
            category_id = int(request.form['category_id'])

            new_transaction = Transaction(description=description, amount=amount, type=type, date=date, budget_id=budget_id, category_id=category_id)
            db.session.add(new_transaction)
            db.session.commit()
        elif 'delete_transaction' in request.form:
            transaction_id = int(request.form['transaction_id'])
            transaction = Transaction.query.get_or_404(transaction_id)
            db.session.delete(transaction)
            db.session.commit()

        return redirect(url_for('main.manage_transactions'))

    budgets = Budget.query.all()
    categories = Category.query.all()
    default_budget_id = budgets[0].id if budgets else None
    transactions = Transaction.query.filter_by(budget_id=default_budget_id).all() if default_budget_id else []
    return render_template('manage_transactions.html', budgets=budgets, categories=categories, transactions=transactions, default_budget_id=default_budget_id)

@bp.route('/get_all_transactions/<int:budget_id>')
def get_all_transactions(budget_id):
    transactions = Transaction.query.filter_by(budget_id=budget_id).all()
    transactions_data = [
        {
            'id': transaction.id,
            'description': transaction.description,
            'amount': transaction.amount,
            'type': transaction.type,
            'date': transaction.date.strftime('%Y-%m-%d'),
            'category': transaction.category.name if transaction.category else 'N/A'
        }
        for transaction in transactions
    ]
    return jsonify(transactions_data)

@bp.route('/transaction/<int:transaction_id>')
def view_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    return render_template('view_transaction.html', transaction=transaction)

@bp.route('/budget/<int:budget_id>', methods=['GET', 'POST'])
def view_budget(budget_id):
    budget = Budget.query.get_or_404(budget_id)
    if request.method == 'POST':
        if 'update_budget' in request.form:
            budget.name = request.form['name']
            budget.amount = float(request.form['amount'])
            db.session.commit()
        elif 'delete_with_transactions' in request.form:
            # Delete all transactions associated with the budget
            Transaction.query.filter_by(budget_id=budget_id).delete()
            db.session.commit()
            # Delete the budget
            db.session.delete(budget)
            db.session.commit()
            return redirect(url_for('main.manage_budgets'))
        elif 'migrate_transactions' in request.form:
            new_budget_id = int(request.form['new_budget_id'])
            # Migrate transactions to the new budget
            transactions = Transaction.query.filter_by(budget_id=budget_id).all()
            for transaction in transactions:
                transaction.budget_id = new_budget_id
            db.session.commit()
            # Delete the old budget
            db.session.delete(budget)
            db.session.commit()
            return redirect(url_for('main.manage_budgets'))

    budgets = Budget.query.all()
    return render_template('view_budget.html', budget=budget, budgets=budgets)

@bp.route('/category/<int:category_id>', methods=['GET', 'POST'])
def view_category(category_id):
    category = Category.query.get_or_404(category_id)
    if request.method == 'POST':
        if 'update_category' in request.form:
            category.name = request.form['name']
            db.session.commit()
        elif 'delete_category' in request.form:
            db.session.delete(category)
            db.session.commit()
            return redirect(url_for('main.manage_categories'))

    return render_template('view_category.html', category=category)

@bp.route('/settings', methods=['GET', 'POST'])
def settings():
    budgets = Budget.query.all()
    settings = Settings.query.first()
    if request.method == 'POST':
        default_budget_id = int(request.form['default_budget_id'])
        if settings:
            settings.default_budget_id = default_budget_id
        else:
            settings = Settings(default_budget_id=default_budget_id)
            db.session.add(settings)
        db.session.commit()
        return redirect(url_for('main.settings'))

    return render_template('settings.html', budgets=budgets, settings=settings)


#### API Endpoints Routes####
@bp.route('/api/expenses')
def get_expenses():
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

@bp.route('/api/transactions')
def get_transactions():
    category_name = request.args.get('category')
    if category_name == 'Uncategorized':
        transactions = Transaction.query.filter_by(type='expense', category_id=None).all()
    else:
        transactions = Transaction.query.join(Category).filter(Transaction.type == 'expense', Category.name == category_name).all()

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

@bp.route('/api/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted successfully'})