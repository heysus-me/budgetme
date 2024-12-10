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
user = User(username='testuser', email='testuser@example.com')
db.session.add(user)
db.session.commit()

# Create budgets
budgets = []
for _ in range(5):
    budget = Budget(
        name=fake.word(),
        amount=round(random.uniform(1000, 5000), 2),
        user_id=user.id
    )
    budgets.append(budget)
    db.session.add(budget)
db.session.commit()

# Create categories
categories = []
for _ in range(10):
    category = Category(name=fake.word())
    categories.append(category)
    db.session.add(category)
db.session.commit()

# Create transactions
for _ in range(100):
    transaction = Transaction(
        description=fake.sentence(),
        amount=round(random.uniform(10, 500), 2),
        type=random.choice(['income', 'expense']),
        date=fake.date_between(start_date='-1y', end_date='today'),
        budget_id=random.choice(budgets).id,
        category_id=random.choice(categories).id
    )
    db.session.add(transaction)
db.session.commit()

print("Database populated with 100 transactions.")