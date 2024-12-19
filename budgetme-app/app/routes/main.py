from flask import render_template
from . import main_bp
from ..models import Budget, Category, Transaction, MonthlyBudget, User
from datetime import datetime

@main_bp.route('/')
def home():
    monthly_budgets = MonthlyBudget.query.all()
    budgets = Budget.query.all()
    categories = Category.query.all()
    transactions = Transaction.query.all()
    today_date = datetime.now().date()
    return render_template(
        'home.html',
        budgets=budgets,
        monthly_budgets=monthly_budgets,
        categories=categories,
        today_date=today_date, 
        transactions=transactions)

@main_bp.route('/monthly_budgets')
def monthly_budgets():
    budgets = MonthlyBudget.query.all()
    users = User.query.all()
    return render_template(
        'monthly_budgets.html',
        budgets=budgets,
        users=users
    )

@main_bp.route('/budgets')
def budgets():
    budgets = Budget.query.all()
    users = User.query.all()
    monthly_budgets = MonthlyBudget.query.all()
    return render_template(
        'budgets.html',
        budgets=budgets,
        users=users,
        monthly_budgets=monthly_budgets
    )

@main_bp.route('/categories')
def categories():
    categories = Category.query.all()
    return render_template(
        'categories.html',
        categories=categories)