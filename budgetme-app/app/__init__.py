
__version__ = "0.1.9"


from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

#Create an instance of the Flask class
def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)

    with app.app_context():
        from . import routes, models
        app.register_blueprint(routes.bp)
        db.create_all()

    return app