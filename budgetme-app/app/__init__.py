
__version__ = "0.1.10"


from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

#Create an instance of the Flask class
def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        from . import routes, models
        from .routes.api import api_bp
        app.register_blueprint(routes.main_bp)
        app.register_blueprint(api_bp, url_prefix='/api')
        db.create_all()

    return app