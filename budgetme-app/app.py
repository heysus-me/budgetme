__version__ = "0.1.1"

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

#Create an instance of the Flask class
app = Flask(__name__)

#Set the configuration for the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Create an instance of the SQLAlchemy class
db = SQLAlchemy(app)

#Import the models module to create the tables
from models import User, Budget


#Define a route for the home page
@app.route('/')
def home():
    return "Welcome to the budgeting Application!"

#Run the app if this file is executed directly
if __name__ == '__main__':
    app.run(debug=True)