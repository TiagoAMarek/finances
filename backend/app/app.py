from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config
from app.database import create_tables
from app.routes import auth_bp, accounts_bp, transactions_bp


def create_app():
    app = Flask(__name__)
    
    # Configure Flask
    app.config["SECRET_KEY"] = Config.SECRET_KEY
    app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
    app.config["DEBUG"] = Config.DEBUG
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}})
    
    # Configure JWT
    jwt = JWTManager(app)
    
    @jwt.user_identity_loader
    def user_identity_lookup(user_id):
        return str(user_id)
    
    # Create database tables
    create_tables()
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(accounts_bp)
    app.register_blueprint(transactions_bp)
    
    # Root route
    @app.route("/")
    def read_root():
        return jsonify({"Hello": "World from Flask"})
    
    return app