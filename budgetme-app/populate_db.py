from faker import Faker
from app import create_app, db
from app.models import User, Budget, Category, Transaction, MonthlyBudget
from datetime import datetime
import random

# Initialize the Flask application and database
app = create_app()
app.app_context().push()

# Initialize Faker
fake = Faker()

# Create a user
user = User(username='user01', email='testuser@example.com')
db.session.add(user)
print(user)
db.session.commit()

# Add budget for the month
todays_date = datetime.now()
month = MonthlyBudget(
    name=todays_date.strftime("%Y_%B"),
    year=todays_date.year,
    month=todays_date.month,
    user_id=user.id
    )
db.session.add(month)
print(month)
db.session.commit()

# Create budgets
budgets = [
    {"name": 'Income', "start_balance": 0.0},
    {"name": 'Utilities', "start_balance": 450},
    {"name": 'Food', "start_balance": 325},
    {"name": 'Transportation', "start_balance": 120},
    {"name": 'Entertainment', "start_balance": 50},
    {"name": 'Healthcare', "start_balance": 0.0},
    {"name": 'Insurance', "start_balance": 252},
    {"name": 'Savings', "start_balance": 50},
    {"name": 'Debt Payments', "start_balance": 300},
    {"name": 'Miscellaneous', "start_balance": 50}
    ]

for budget in budgets:
    budget = Budget(
        name=budget["name"],
        start_balance=budget["start_balance"],
        user_id=0,
        monthly_budget_id=month.id
    )
    db.session.add(budget)

db.session.add(budget)
print(budget)
db.session.commit()