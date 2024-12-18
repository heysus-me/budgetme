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

# Create categories
categories = []
for _ in range(10):
    category = Category(name=fake.word())
    categories.append(category)
    db.session.add(category)
db.session.commit()

# Create transactions for each category
for category in categories:
    num_transactions = random.randint(5, 10)
    for _ in range(num_transactions):
        transaction = Transaction(
            description=fake.sentence(),
            amount=round(random.uniform(10, 500), 2),
            type=random.choice(['income', 'expense']),
            budget_id=budget.id,
            date=fake.date_time_this_year(),
            category_id=category.id
        )
        db.session.add(transaction)
db.session.commit()

print("Database populated with 100 transactions.")