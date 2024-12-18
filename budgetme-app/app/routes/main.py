from flask import render_template
from . import main_bp
from ..models import Budget, Category, Transaction
from datetime import datetime

@main_bp.route('/')
def home():
    budgets = Budget.query.all()
    categories = Category.query.all()
    transactions = Transaction.query.all()
    today_date = datetime.now().date()
    return render_template(
        'home.html',
        budgets=budgets,
        categories=categories,
        today_date=today_date, 
        transactions=transactions)

@main_bp.route('/budgets')
def budgets():
    budgets = Budget.query.all()
    return render_template(
        'budgets.html',
        budgets=budgets)