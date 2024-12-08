# config.py

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///budget.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret key for session management and other security-related needs
    SECRET_KEY = 'your_secret_key'

    # Other configuration settings can go here