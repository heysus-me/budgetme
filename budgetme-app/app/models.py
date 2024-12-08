
from . import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

class Budget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('budgets', lazy=True))

    def __repr__(self):
        return f'<Budget {self.name}>'

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Category {self.name}>'

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # 'income' or 'expense'
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    budget_id = db.Column(db.Integer, db.ForeignKey('budget.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)

    budget = db.relationship('Budget', backref=db.backref('transactions', lazy=True))
    category = db.relationship('Category', backref=db.backref('transactions', lazy=True))

    def __repr__(self):
        return f'<Transaction {self.description}>'

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    default_budget_id = db.Column(db.Integer, db.ForeignKey('budget.id'), nullable=True)

    default_budget = db.relationship('Budget', backref=db.backref('settings', lazy=True))

    def __repr__(self):
        return f'<Settings {self.default_budget_id}>'

class UserOptions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    default_budget_id = db.Column(db.Integer, db.ForeignKey('budget.id'), nullable=True)

    user = db.relationship('User', backref=db.backref('options', lazy=True))
    default_budget = db.relationship('Budget', backref=db.backref('user_options', lazy=True))

    def __repr__(self):
        return f'<UserOptions {self.user_id} - {self.default_budget_id}>'
