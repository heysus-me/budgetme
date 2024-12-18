from faker import Faker
from app import create_app, db
from app.models import User, Budget, Category, Transaction
from datetime import datetime
import random

# Initialize the Flask application and database
app = create_app()
app.app_context().push()

# Initialize Faker
fake = Faker()

# Create a user
# user = User(username='testuser', email='testuser@example.com')
# db.session.add(user)
# db.session.commit()

# Create budgets
budgets = []
# Create a budget
budget = Budget(
    name='Monthly Budget2',
    start_balance=round(random.uniform(1000, 5000), 2),
    user_id=0
)
db.session.add(budget)
db.session.commit()

# Create common budget categories
common_categories = [
    'Food', 'Utilities', 'Rent', 'Transportation', 'Entertainment',
    'Healthcare', 'Insurance', 'Savings', 'Debt Payments', 'Miscellaneous', 'Paycheck'
]

categories = []
for category_name in common_categories:
    category = Category(name=category_name)
    categories.append(category)
    db.session.add(category)
print(categories)
db.session.commit()

# Create expense transactions for each category, except for Paycheck
for i in range(50):
    category = random.choice(categories[:-1])
    transaction = Transaction(
        description=fake.sentence(),
        amount=round(random.uniform(1, 100), 2),
        type='expense',
        date=fake.date_time_this_year(),
        category_id=category.id,
        budget_id=budget.id
    )
    print(transaction)
    db.session.add(transaction)
db.session.commit()

# Create income transactions for Paycheck category
for i in range(3):
    transaction = Transaction(
        description=fake.sentence(),
        amount=round(random.uniform(1000, 3000), 2),
        type='income',
        date=fake.date_time_this_year(),
        category_id=categories[-1].id,
        budget_id=budget.id
    )
    db.session.add(transaction)
print(transaction)
db.session.commit()


print("Database populated with 100 transactions.")