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
user = User(username='jescobar', email='testuser@example.com')
db.session.add(user)
print(user)
db.session.commit()

# Add budget for the month
todays_date = datetime.now()
month = MonthlyBudget(
    name=todays_date.strftime("%Y_%B"),
    year=todays_date.year,
    month=todays_date.month,
    user_id=0
    )
db.session.add(month)
print(month)
db.session.commit()

# Create budgets
budgets = [
    {"name": 'Income', "start_balance": 0.0},
    {"name": 'Rent', "start_balance": 0.0},
    {"name": 'Utilities', "start_balance": 0.0},
    {"name": 'Food', "start_balance": 0.0},
    {"name": 'Transportation', "start_balance": 0.0},
    {"name": 'Entertainment', "start_balance": 0.0},
    {"name": 'Healthcare', "start_balance": 0.0},
    {"name": 'Insurance', "start_balance": 0.0},
    {"name": 'Savings', "start_balance": 0.0},
    {"name": 'Debt Payments', "start_balance": 0.0},
    {"name": 'Miscellaneous', "start_balance": 0.0}
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

# Create common budget categories
common_categories = [
    'Paycheck',
    'Gas',
    'Groceries',
    'Restaurants',
    'Internet',
    'Electricity',
    'Water',
    'Phone',
]

categories = []
for category_name in common_categories:
    category = Category(name=category_name)
    categories.append(category)
    db.session.add(category)
print(categories)
db.session.commit()

# # Create expense transactions for each category, except for Paycheck
# for i in range(50):
#     category = random.choice(categories[:-1])
#     transaction = Transaction(
#         description=fake.sentence(),
#         amount=round(random.uniform(1, 100), 2),
#         type='expense',
#         date=fake.date_time_this_year(),
#         category_id=category.id,
#         budget_id=budget.id
#     )
#     print(transaction)
#     db.session.add(transaction)
# db.session.commit()

# # Create income transactions for Paycheck category
# for i in range(3):
#     transaction = Transaction(
#         description=fake.sentence(),
#         amount=round(random.uniform(1000, 3000), 2),
#         type='income',
#         date=fake.date_time_this_year(),
#         category_id=categories[-1].id,
#         budget_id=budget.id
#     )
#     db.session.add(transaction)
# print(transaction)
# db.session.commit()


# print("Database populated with 100 transactions.")