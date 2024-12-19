from . import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

class MonthlyBudget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    starting_balance = db.Column(db.Float, default=0.0, nullable=False)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('monthly_budgets', lazy=True, cascade='all, delete-orphan'))
    budgets = db.relationship('Budget', backref='monthly_budget', lazy=True, cascade='all, delete-orphan')

    @property
    def income(self):
        return sum(budget.income for budget in self.budgets)

    @property
    def expenses(self):
        return sum(budget.expenses for budget in self.budgets)
        
    @property
    def end_balance(self):
        return self.starting_balance + (self.income - self.expenses)

    def __repr__(self):
        return f'<MonthlyBudget {self.name} {self.year}>'

class Budget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_balance = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    monthly_budget_id = db.Column(db.Integer, db.ForeignKey('monthly_budget.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('budgets', lazy=True))
    transactions = db.relationship('Transaction', backref='budget', lazy=True, cascade='all, delete-orphan')

    @property
    def income(self):
        return sum(transaction.amount for transaction in self.transactions if transaction.type == 'income')

    @property
    def expenses(self):
        return sum(transaction.amount for transaction in self.transactions if transaction.type == 'expense')

    @property
    def end_balance(self):
        return self.start_balance + (self.income - self.expenses)

    def __repr__(self):
        return f'<Budget {self.name}>'

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)
    budget_id = db.Column(db.Integer, db.ForeignKey('budget.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)

    category = db.relationship('Category', backref=db.backref('transactions', lazy=True))


    def __repr__(self):
        return f'<Transaction {self.description} {self.amount}>'

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Category {self.name}>'