__version__ = "0.1.1"

from flask import Flask

#Create an instance of the Flask class
app = Flask(__name__)

#Define a route for the home page
@app.route('/')
def home():
    return "Welcome to the budgeting Application!"

#Run the app if this file is executed directly
if __name__ == '__main__':
    app.run(debug=True)