from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.exceptions import AppException
from app.database import get_db_context


def handle_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except AppException as e:
            return jsonify({"detail": e.message}), e.status_code
        except Exception as e:
            return jsonify({"detail": "Internal server error"}), 500
    return decorated_function


def require_auth(f):
    @wraps(f)
    @jwt_required()
    @handle_errors
    def decorated_function(*args, **kwargs):
        user_id = int(get_jwt_identity())
        with get_db_context() as db:
            return f(db, user_id, *args, **kwargs)
    return decorated_function