from flask import Blueprint

main_bp = Blueprint('main', __name__)
api_bp = Blueprint('api', __name__)
# budget_bp = Blueprint('budget', __name__)
# category_bp = Blueprint('category', __name__)
# transaction_bp = Blueprint('transaction', __name__)
# settings_bp = Blueprint('settings', __name__)

from . import main, api
# budget, category, transaction, settings,