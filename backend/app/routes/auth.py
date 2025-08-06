from flask import Blueprint, request, jsonify
from app.schemas import UserCreate, UserLogin, UserResponse, TokenResponse
from app.services import AuthService
from app.database import get_db_context
from app.utils.decorators import handle_errors

auth_bp = Blueprint('auth', __name__)


@auth_bp.route("/register", methods=["POST"])
@handle_errors
def register():
    try:
        user_data = UserCreate(**request.json)
    except Exception as e:
        return jsonify({"detail": "Invalid input data"}), 400
    
    with get_db_context() as db:
        user = AuthService.create_user(db, user_data)
        return jsonify({
            "message": "User registered successfully",
            "user": UserResponse.model_validate(user).model_dump()
        }), 201


@auth_bp.route("/login", methods=["POST"])
@handle_errors
def login():
    login_data = UserLogin(**request.json)
    with get_db_context() as db:
        access_token = AuthService.authenticate_user(db, login_data)
        return jsonify(TokenResponse(access_token=access_token).model_dump()), 200